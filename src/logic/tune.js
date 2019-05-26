import { StaveNote } from 'vexflow/src/stavenote';
import { TabNote } from 'vexflow/src/tabnote';
import { Beam } from 'vexflow/src/beam';
import Vex from 'vexflow';
import { Stave } from 'vexflow/src/stave';
import { TabStave } from 'vexflow/src/tabstave';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import VexUtils from './vex-utils';

export default {
  // take the abcjs parser output and turn it into an array of bars
  // (vexflow rendering works in terms of bars,
  // but abcjs just supplies a big array of note, note, barline, note, etc.)
  getBars(musicalObjects, abcKeySignature, clef) {
    // INITIALIZE VARIABLES
    let currentStaveNotes = [];
    let currentTabNotes = [];
    let nextBarDecorations = [];
    const bars = [];
    let inVolta = 0; // 0 = nothing, 1 or 2 means we're in ending 1 or 2 or whateer
    let barVoltaStarted = 0;

    function Bar() {
      this.notes = [];
      this.tabNotes = [];
      this.beams = [];
      this.decorations = [];
      this.tabDecorations = [];
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.volta = {
        type: 0,
        number: 0
      };
    }

    // console.log('got musicalObjects, was: ');
    // console.log(musicalObjects);

    musicalObjects.forEach((obj) => {
      switch (obj.el_type) {
        case 'note': {
          if (obj.rest) {
            break; // TODO implement
          }

          const keys = VexUtils.getKeys(obj.pitches);
          const accidentals = VexUtils.getAccidentals(obj.pitches);
          let noteDuration = obj.duration;
          let isDotted = false;

          for (let j = 0; j < 5; j += 1) {
            const pow = 2 ** j;
            if (obj.duration === 1 / pow + (1 / pow) * 0.5) {
              noteDuration = 1 / pow;
              isDotted = true;
            }
          }
          const duration = (1 / noteDuration).toString();

          const noteToAdd = new StaveNote({
            clef, keys, duration, auto_stem: true
          });
          if (isDotted) {
            noteToAdd.addDotToAll();
          }
          accidentals.forEach((accidental, i) => {
            if (accidental) {
              noteToAdd.addAccidental(i, new Vex.Flow.Accidental(accidental));
            }
          });

          if (obj.chord) {
            noteToAdd.addModifier(0, new Vex.Flow.Annotation(obj.chord[0].name) // why [0]
              .setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.TOP));
          }

          currentStaveNotes.push(noteToAdd);

          /* TAB */
          const tabNoteToAdd = new TabNote({
            positions: VexUtils.getTabPosition(keys, accidentals, abcKeySignature),
            duration
          });
          if (isDotted) {
            tabNoteToAdd.addDot();
          }
          currentTabNotes.push(tabNoteToAdd);

          break;
        }
        case 'bar': {
          /*
            there is a problem with the order of creating new volta, evaluating existing volta,
            and creating the bar. if we don't check voltas before we break due to multiple bars,
            we could possibly miss a volta marker if it's part of a series of multiple bars.

            maybe we should collapse multiple bars into one and add their modifiers together
            before even getting to this point. it would make the multiple bar thing
            null.
          */

          const currentBar = new Bar();

          if (inVolta !== 0 && !obj.endEnding) { // and isn't ending right now
            if (barVoltaStarted === bars.length - 1) { // started last bar
              currentBar.volta = {
                type: Vex.Flow.Volta.type.BEGIN,
                number: inVolta
              };
            } else { // started previously
              currentBar.volta = {
                type: Vex.Flow.Volta.type.MID,
                number: inVolta
              };
            }
          } else if (inVolta !== 0) { // and IS ending right now
            if (barVoltaStarted === bars.length - 1) { // started last bar and is ending this one
              currentBar.volta = {
                type: Vex.Flow.Volta.type.BEGIN_END,
                number: inVolta
              };
            } else {
              currentBar.volta = {
                type: Vex.Flow.Volta.type.END, // started some other time
                number: inVolta
              };
            }
            inVolta = 0; // end volta
          }

          // handle new volta
          if (obj.startEnding) {
            inVolta = obj.startEnding;
            barVoltaStarted = bars.length;
          }

          nextBarDecorations.forEach((decoration) => {
            currentBar.decorations.push(decoration);
          });
          nextBarDecorations = [];

          if (obj.type === 'bar_right_repeat') {
            currentBar.decorations.push(Vex.Flow.Barline.type.REPEAT_END);
          } else if (obj.type === 'bar_left_repeat') {
            nextBarDecorations.push(Vex.Flow.Barline.type.REPEAT_BEGIN);
          }

          /*
            so auto beaming somehow sets the stem-direction. but I thought we got beaming from
            abcjs.. yeah, we do. I was using it but somehow lost it in refactor. I want to use that,
            but calculate stem direction based off it (because beam groups must share stem direction)

            it will be best to calculate the stem direction of the beam group by the first... note
            since that will probably be the one that may have a chord symbol above it, and want to make
            sure that the stem is pointing down if necessary if a chord symbol is above it

            abcjs just doesn't give stem direction?
          */

          // ONLY WANT TO USE THIS CODE FOR 6/8 TUNES
          // currentBar.beams = VexUtils.generateBeams(currentStaveNotes);
          // if (beams.length == 0) {
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
  },

  // take the array of bars and determine the x, y, and width of each bar based on the # of notes in the bar
  positionBars(bars, RENDER_WIDTH) {
    // SINCE I'M MULTIPLYING BY WIDTH FACTOR, BARS WITH 0 NOTES END UP WITH 0 WIDTH. THE INTERESTING EFFECT
    // IS THAT THIS HIDES THE PROBLEM OF DOUBLE BARLINES, SINCE THE MEASURE IS 0 WIDTH. DO I WANT IT THIS WAY?

    // o yeah what's happening is that when there's extra with, and it's granted to all the other bars, it will
    // also be added to the zero width bar.
    const X_OFFSET = 3;
    const WIDTH_FACTOR = 27;
    const LINE_HEIGHT = 190;
    const CLEFS_AND_SIGS_WIDTH = 120;

    bars.forEach((bar, i) => {
      let idealWidth = bar.notes.length * WIDTH_FACTOR;
      if (idealWidth > RENDER_WIDTH) {
        idealWidth = RENDER_WIDTH;
      }

      if (i === 0) { // first bar
        bar.x = X_OFFSET;
        bar.y = 0;
        bar.width = idealWidth + CLEFS_AND_SIGS_WIDTH;
      } else if (bars[i - 1].x + bars[i - 1].width >= RENDER_WIDTH) { // first bar on a new line
        bar.x = X_OFFSET;
        bar.y = bars[i - 1].y + LINE_HEIGHT;
        bar.width = idealWidth;
      } else { // bar on an incomplete line
        bar.x = bars[i - 1].x + bars[i - 1].width;
        bar.y = bars[i - 1].y;
        bar.width = idealWidth;

        // check if next bar won't fit or there is no next bar. actually this is supposed to
        // work when there's no next bar but it doesn't work...
        if (!bars[i + 1] || bar.x + idealWidth + (bars[i + 1].notes.length * WIDTH_FACTOR) > RENDER_WIDTH) {
          let extraSpace = (RENDER_WIDTH - bar.x) - idealWidth;
          let barsOnThisLine = 1;

          for (let j = i - 1; bars[j] && bars[j].y === bar.y; j -= 1) {
            barsOnThisLine += 1;
          }

          // if there will be extra space because the next bar won't fit,
          // divide the extra space equally between all the bars on this line
          let spaceAdded = 0;
          for (let k = barsOnThisLine - 1; k >= 0; k -= 1) {
            const spaceToAdd = Math.floor(extraSpace / (k + 1));
            bars[i - k].x += spaceAdded;
            bars[i - k].width += spaceToAdd;
            extraSpace -= spaceToAdd;
            spaceAdded += spaceToAdd;
          }
        } else {
          bar.width = idealWidth;
        }
      }
    });
    return bars;
  },

  // take positionedBars and render it to the supplied VexFlow context
  render(positionedBars, clef, meter, keySignature, context) {
    positionedBars.forEach((bar, index) => {
      if (index === 0) {
        // to "split" the first stave secretly so that the modifiers don't mess up the tab note alignment
        const clefsStave = new Stave(bar.x, bar.y, Math.floor(bar.width / 2), { right_bar: false });
        const clefsTabStave = new TabStave(bar.x, bar.y + 50, Math.floor(bar.width / 2), { right_bar: false });
        clefsStave.setContext(context);
        clefsTabStave.setContext(context);
        clefsStave.setClef(clef);
        clefsStave.setKeySignature(keySignature);
        clefsStave.setTimeSignature(meter);
        clefsStave.draw();
        clefsTabStave.draw();

        bar.x += Math.floor(bar.width / 2);
        bar.width -= Math.floor(bar.width / 2);

        var stave = new Stave(bar.x, bar.y, bar.width, { left_bar: false });
        stave.setContext(context);
        var tabStave = new TabStave(bar.x, bar.y + 50, bar.width, { left_bar: false });
        tabStave.setContext(context);
      } else {
        var stave = new Stave(bar.x, bar.y, bar.width);
        stave.setContext(context);
        var tabStave = new TabStave(bar.x, bar.y + 50, bar.width);
        tabStave.setContext(context);
      }

      if (bar.volta.type !== 0) { // it's not type 0 which means not there...
        stave.setVoltaType(bar.volta.type, bar.volta.number.toString(), 10);
      }

      bar.decorations.forEach((decoration) => {
        switch (decoration) {
          case Vex.Flow.Barline.type.REPEAT_BEGIN: // these are integer constants...
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
};
