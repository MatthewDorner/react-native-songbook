import { StaveNote } from 'vexflow/src/stavenote';
import { TabNote } from 'vexflow/src/tabnote';
import { Beam } from 'vexflow/src/beam';
import Vex from 'vexflow';
import { Stave } from 'vexflow/src/stave';
import { TabStave } from 'vexflow/src/tabstave';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import ABCJS from 'abcjs';
import Bar from './bar';
import VexUtils from './vex-utils';

export default class Tune {
  constructor(abcString, renderOptions) {
    this.renderOptions = renderOptions;

    // GET THE PARSED OBJECT AND PROPERTIES
    const parsedObject = ABCJS.parseOnly(abcString);
    const musicalObjects = parsedObject[0].lines
      .map(line => line.staff[0].voices[0])
      .reduce((acc, val) => acc.concat(val), []);

    if (!parsedObject[0].lines[0]) {
      return; // context will be empty and can be rendered to blank
    }

    // GET THE TUNE ATTRIBUTES
    this.tuneAttrs = {
      meter: VexUtils.getMeter(abcString),
      clef: parsedObject[0].lines[0].staff[0].clef.type,
      abcKeySignature: parsedObject[0].lines[0].staff[0].key,
      vexKeySignature: VexUtils.convertKeySignature(parsedObject[0].lines[0].staff[0].key)
    };

    // PROCESS AND RENDER
    this.bars = this.generateBars(musicalObjects);
    this.setBarPositions(); // will mutate this.bars
  }

  // take the abcjs parser output and turn it into an array of bars
  // (vexflow rendering works in terms of bars,
  // but abcjs just supplies a big array of note, note, barline, note, etc.)
  generateBars(musicalObjects) {
    const bars = [];

    // VARIABLES THAT TRACK STATE BETWEEN MUSICALOBJECTS
    let currentStaveNotes = [];
    let currentTabNotes = [];

    // VARIABLES THAT TRACK STATE BETWEEN BARS
    let nextBarDecorations = [];
    let inVolta = 0; // 0 = nothing, 1 or 2 means we're in ending 1 or 2 or whateer
    let barVoltaStarted = 0;

    musicalObjects.forEach((obj) => {
      switch (obj.el_type) {
        case 'note': {
          if (obj.rest) {
            break; // TODO implement
          }

          // PROCESS PROPERTIES INTO VEXFLOW-FRIENDLY FORMS
          const keys = VexUtils.getKeys(obj.pitches);
          const accidentals = VexUtils.getAccidentals(obj.pitches);
          const { duration, isDotted } = VexUtils.getVexDuration(obj.duration);

          // CREATE AND ADD MODIFIERS TO STAVE NOTE
          const noteToAdd = new StaveNote({
            clef: this.tuneAttrs.clef, keys, duration, auto_stem: true
          });
          if (isDotted) { noteToAdd.addDotToAll(); }
          accidentals.forEach((accidental, i) => {
            if (accidental) { noteToAdd.addAccidental(i, new Vex.Flow.Accidental(accidental)); }
          });
          if (obj.chord) {
            noteToAdd.addModifier(0, new Vex.Flow.Annotation(obj.chord[0].name) // why [0]
              .setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.TOP));
          }

          // CREATE AND ADD MODIFIERS TO TAB NOTE
          const tabNoteToAdd = new TabNote({
            positions: VexUtils.getTabPosition(keys, accidentals, this.tuneAttrs.abcKeySignature),
            duration
          });
          if (isDotted) { tabNoteToAdd.addDot(); }

          currentStaveNotes.push(noteToAdd);
          currentTabNotes.push(tabNoteToAdd);
          break;
        }
        case 'bar': {
          const currentBar = new Bar();

          // handle existing volta
          if (inVolta) {
            currentBar.volta = VexUtils.getVolta(obj, bars.length, barVoltaStarted, inVolta);
            if (currentBar.volta.type === Vex.Flow.Volta.type.BEGIN_END
              || currentBar.volta.type === Vex.Flow.Volta.type.END) {
              inVolta = 0;
            }
          }

          // handle new volta
          if (obj.startEnding) {
            inVolta = obj.startEnding;
            barVoltaStarted = bars.length;
          }

          // handle decorations from previous barline that apply to this bar
          currentBar.decorations = nextBarDecorations;
          nextBarDecorations = [];

          // apply decorations found in this barline object
          if (obj.type === 'bar_right_repeat') {
            currentBar.decorations.push(Vex.Flow.Barline.type.REPEAT_END);
          } else if (obj.type === 'bar_left_repeat') {
            nextBarDecorations.push(Vex.Flow.Barline.type.REPEAT_BEGIN);
          }

          // ONLY WANT TO USE THIS CODE FOR 6/8 TUNES
          // currentBar.beams = VexUtils.generateBeams(currentStaveNotes);
          // if (currentBar.beams.length === 0) {
          //   currentBar.beams = Beam.generateBeams(currentStaveNotes);
          // }
          currentBar.beams = Beam.generateBeams(currentStaveNotes);

          currentBar.notes = currentStaveNotes;
          currentBar.tabNotes = currentTabNotes;
          currentStaveNotes = [];
          currentTabNotes = [];

          bars.push(currentBar);
          break;
        }
        default:
          break;
      }
    });
    return bars;
  }

  // take the array of bars and determine the x, y, and width of
  // each bar based on the # of notes in the bar
  setBarPositions() {
    const {
      renderWidth, xOffset, widthFactor, lineHeight, clefsAndSigsWidth
    } = this.renderOptions;

    const positionedBars = this.bars.map((bar, i) => {
      const positionedBar = bar;
      let idealWidth = bar.notes.length * widthFactor;
      if (idealWidth > renderWidth) {
        idealWidth = renderWidth;
      }

      if (i === 0) { // first bar
        positionedBar.position.x = xOffset;
        positionedBar.position.y = 0;
        positionedBar.position.width = idealWidth + clefsAndSigsWidth;
      } else if (this.bars[i - 1].position.x + this.bars[i - 1].position.width >= renderWidth) { // first bar on a new line
        positionedBar.position.x = xOffset;
        positionedBar.position.y = this.bars[i - 1].position.y + lineHeight;
        positionedBar.position.width = idealWidth;
      } else { // bar on an incomplete line
        positionedBar.position.x = this.bars[i - 1].position.x + this.bars[i - 1].position.width;
        positionedBar.position.y = this.bars[i - 1].position.y;
        positionedBar.position.width = idealWidth;

        // check if next bar won't fit or there is no next bar. actually this doesn't work
        // if there's only one bar on the final line
        if (!this.bars[i + 1] || bar.position.x + idealWidth + (this.bars[i + 1].notes.length * widthFactor) > renderWidth) {
          let extraSpace = (renderWidth - bar.position.x) - idealWidth;
          let barsOnThisLine = 1;

          for (let j = i - 1; this.bars[j] && this.bars[j].position.y === bar.position.y; j -= 1) {
            barsOnThisLine += 1;
          }

          // if there will be extra space at the end because the next bar won't fit,
          // divide the extra space equally between all the bars on this line
          let spaceAdded = 0;
          for (let k = barsOnThisLine - 1; k >= 0; k -= 1) {
            const spaceToAdd = Math.floor(extraSpace / (k + 1));
            this.bars[i - k].position.x += spaceAdded;
            this.bars[i - k].position.width += spaceToAdd;
            extraSpace -= spaceToAdd;
            spaceAdded += spaceToAdd;
          }
        } else {
          positionedBar.position.width = idealWidth;
        }
      }
      return positionedBar;
    });
    this.bars = positionedBars;
  }

  // take positionedBars and draw it to the supplied VexFlow context
  drawToContext(context) {
    if (!this.bars) {
      return;
    }
    const { clef, meter, vexKeySignature } = this.tuneAttrs;
    let stave;
    let tabStave;
    this.bars.forEach((bar, index) => {
      if (index === 0) {
        // to "split" the first stave w/ invisible bar line so that the modifiers don't mess up the tab note alignment
        const clefsStave = new Stave(bar.position.x, bar.position.y, Math.floor(bar.position.width / 2), { right_bar: false });
        const clefsTabStave = new TabStave(bar.position.x, bar.position.y + 50, Math.floor(bar.position.width / 2), { right_bar: false });

        clefsStave.setContext(context);
        clefsStave.setClef(clef);
        clefsStave.setKeySignature(vexKeySignature);
        clefsStave.setTimeSignature(meter);
        clefsStave.draw();

        clefsTabStave.setContext(context);
        clefsTabStave.draw();

        bar.position.x += Math.floor(bar.position.width / 2);
        bar.position.width -= Math.floor(bar.position.width / 2);

        stave = new Stave(bar.position.x, bar.position.y, bar.position.width, { left_bar: false });
        stave.setContext(context);
        tabStave = new TabStave(bar.position.x, bar.position.y + 50, bar.position.width, { left_bar: false });
        tabStave.setContext(context);
      } else {
        stave = new Stave(bar.position.x, bar.position.y, bar.position.width);
        stave.setContext(context);
        tabStave = new TabStave(bar.position.x, bar.position.y + 50, bar.position.width);
        tabStave.setContext(context);
      }

      if (bar.volta.type !== 0) { // it's not type 0 which means not there...
        stave.setVoltaType(bar.volta.type, bar.volta.number.toString(), 10);
      }

      bar.decorations.forEach((decoration) => {
        switch (decoration) {
          case Vex.Flow.Barline.type.REPEAT_BEGIN:
            stave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
            tabStave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
            break;
          case Vex.Flow.Barline.type.REPEAT_END:
            stave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
            tabStave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
            break;
          default:
            break;
        }
      });

      // WHAT DOES VOICE EVEN DO? it seems like I wasn't doing anything wiht it before.
      const voice = new Voice({ num_beats: meter.charAt(0), beat_value: meter.charAt(2) });
      voice.setStrict(false);
      voice.addTickables(bar.notes);

      // DRAW
      stave.draw();
      Formatter.FormatAndDraw(context, stave, bar.notes);
      bar.beams.forEach((b) => { b.setContext(context).draw(); });
      tabStave.draw();
      Formatter.FormatAndDraw(context, tabStave, bar.tabNotes);
    });
  }
}
