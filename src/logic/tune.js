import { Beam } from 'vexflow/src/beam';
import Vex from 'vexflow';
import { Stave } from 'vexflow/src/stave';
import { TabStave } from 'vexflow/src/tabstave';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import ABCJS from 'abcjs';
import Bar from './bar';
import VexUtils from './vex-utils';
import { StaveNote } from 'vexflow/src/stavenote';
import { TabNote } from 'vexflow/src/tabnote';

export default class Tune {
  constructor(abcString, renderOptions) {
    this.renderOptions = renderOptions;

    // GET THE PARSED OBJECT AND PROPERTIES
    const parsedObject = ABCJS.parseOnly(abcString);
    console.log('got parsedObject:');
    console.log(parsedObject);

    const tuneObjArray = parsedObject[0].lines
      .map(line => line.staff[0].voices[0])
      .reduce((acc, val) => acc.concat(val), []);
    console.log('got tuneObjArray:');
    console.log(tuneObjArray);

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
    const structuredTune = this.parseTuneStructure(tuneObjArray);
    console.log('got structured tune: ');
    console.log(structuredTune);
    this.tuneData = this.generateVexObjects(structuredTune);
    console.log('got tuneData: ');
    console.log(this.tuneData);
    this.removeEmptyBars();
    console.log('after removing: ');
    console.log(this.tuneData);
    this.setBarPositions();
    console.log('positioned bars: ');
    console.log(this.tuneData);
  }

  parsePartStructure(partObjArray) {
    let bars = []; // array of BarRegion objects to return
    function BarRegion() {
      this.startBarLine = {};
      this.endBarLine = {};
      this.contents = [];
    }

    // variables that hold parser state + initialization of those
    let currentBar = new BarRegion();
    let currentBarObjects = [];

    partObjArray.forEach((obj, i) => {
      switch (obj.el_type) {
        case 'bar':
          if (i === 0) { // if it's the very first obj, just apply it to the (empty) currentBar
            currentBar.startBarLine = obj;
          } else { // apply the current bar and push
            currentBar.endBarLine = obj;
            currentBar.contents = currentBarObjects;
            bars.push(currentBar);
          }
          if (i !== obj.length) { // reset the state 2 prepare for next bar
            currentBar = new BarRegion();
            currentBarObjects = [];
            currentBar.startBarLine = obj;
          }
          break;
        default:
          currentBarObjects.push(obj);
          break;
      }
    });

    // deal with the last bar (if the last object was a barline, this shouldn't execute)
    if (currentBarObjects.length > 0) {
      currentBar.contents = currentBarObjects;
      bars.push(currentBar);
    }

    return bars;
  }

  parseTuneStructure(tuneObjArray) {
    let partRegions = []; // array of PartRegion objects to return
    function PartRegion(title) {
      this.title = title;
      this.barRegions = []; // the BarRegion object defined in parsePartStructure()
    }

    // variables that hold parser state + initialization of those
    let currentPart = new PartRegion("default");
    let currentPartObjects = [];

    tuneObjArray.forEach((obj) => {
      switch (obj.el_type) {
        case 'part':
          if (currentPartObjects.length === 0) {
            // if the current part is still empty, just rename the current part
            currentPart.title = obj.title;
          } else {
            // convert and apply bars to part, push to partRegions[]
            currentPart.barRegions = this.parsePartStructure(currentPartObjects);            
            partRegions.push(currentPart);
            // reset the state variables
            currentPartObjects = [];
            currentPart = new PartRegion(obj.title);
          }
          break;
        default:
          currentPartObjects.push(obj);
          break;
      }
    });

    // deal with the final part also ignore final part if it's empty
    if (currentPartObjects.length > 0) {
      currentPart.barRegions = this.parsePartStructure(currentPartObjects);            
      partRegions.push(currentPart);
    }
    return partRegions;
  }

  generateVexObjects(partRegions) {
    // array of VexPart objects to return
    const parts = [];
    function Part(title) {
      this.title = title;
      this.bars = []; // the Bar class from bar.js
    }

    // state to keep track of through entire tune, reluctantly
    let currentVexKeySignature = this.tuneAttrs.vexKeySignature;

    partRegions.forEach((partRegion, i) => {
      const currentPart = new Part(partRegion.title);
      parts.push(currentPart);

      partRegion.barRegions.forEach((barRegion, i) => {
        const currentBar = new Bar();
        currentPart.bars.push(currentBar);

        barRegion.contents.forEach((obj, i) => {
          if (obj.el_type == 'key') {
            currentAbcKeySignature = obj;
            currentVexKeySignature = VexUtils.convertKeySignature(obj);
            currentBar.keySig = currentVexKeySignature;
            return;
          }

          if (obj.rest || obj.el_type != 'note') {
            return; // TODO implement
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
            positions: VexUtils.getTabPosition(keys, this.tuneAttrs.abcKeySignature, barRegion.contents, i),
            duration
          });
          if (isDotted) { tabNoteToAdd.addDot(); }

          currentBar.notes.push(noteToAdd);
          currentBar.tabNotes.push(tabNoteToAdd);

        }); // end of bar.contents.forEach

        currentBar.volta = VexUtils.getVolta(barRegion);

        if (['bar_right_repeat', 'bar_dbl_repeat'].includes(barRegion.endBarLine.type)) {
          currentBar.repeats.push(Vex.Flow.Barline.type.REPEAT_END);
        }
        if (['bar_left_repeat', 'bar_dbl_repeat'].includes(barRegion.startBarLine.type)) {
          currentBar.repeats.push(Vex.Flow.Barline.type.REPEAT_BEGIN);
        }

        currentBar.beams = Beam.generateBeams(currentBar.notes);
      }); // end of part.bars.forEach
    }); // end of parts.forEach
    return parts;
  }

  removeEmptyBars() {
    this.tuneData = this.tuneData.map(function(part) {
      let bars = part.bars.filter(function(bar, i) {
        if (bar.notes.length == 0) {

          // NEED THIS TO ALSO SHIFT KEY-SIG CHANGES, AS WELL AS REMEMBER THAT THERE MIGHT BE
          // ADDITIONAL THINGS IN THE FUTURE THAT WILL NEED TO BE INCLUDED

          if (bar.repeats.includes(Vex.Flow.Barline.type.REPEAT_END)) {
            if (bars[i - 1]) {
              bars[i - 1].repeats.push(Vex.Flow.Barline.type.REPEAT_END);
            }
          }
          if (bar.repeats.includes(Vex.Flow.Barline.type.REPEAT_BEGIN)) {
            if (bars[i + 1]) {
              bars[i + 1].repeats.push(Vex.Flow.Barline.type.REPEAT_BEGIN);
            }
          }

          return false;
        }
        return true;
      });
      return {
        title: part.title,
        bars: bars
      }
    });
  }

  setBarPositions() {
    const {
      renderWidth, xOffset, widthFactor, lineHeight, clefsAndSigsWidth, repeatWidthModifier, minWidthMultiplier
    } = this.renderOptions;

    // flatten out the parts for now until I do option to separate parts
    this.tuneData = this.tuneData
      .map(part => part.bars)
      .reduce((acc, val) => acc.concat(val), []);

    this.tuneData = this.tuneData.map((bar, i) => {
      const positionedBar = bar;
      let minWidth = bar.notes.length * widthFactor;

      if (bar.repeats.includes(Vex.Flow.Barline.type.REPEAT_END)) {
        minWidth += repeatWidthModifier;
      }

      if (minWidth > renderWidth) {
        minWidth = renderWidth;
      }

      if (minWidth < widthFactor * minWidthMultiplier) {
        minWidth = widthFactor * minWidthMultiplier;
      }

      if (i === 0) { // first bar
        positionedBar.position.x = xOffset;
        positionedBar.position.y = 0;
        positionedBar.position.width = minWidth + clefsAndSigsWidth;
      } else if (this.tuneData[i - 1].position.x + this.tuneData[i - 1].position.width >= renderWidth) { // first bar on a new line
        positionedBar.position.x = xOffset;
        positionedBar.position.y = this.tuneData[i - 1].position.y + lineHeight;
        positionedBar.position.width = minWidth;
      } else { // bar on an incomplete line
        positionedBar.position.x = this.tuneData[i - 1].position.x + this.tuneData[i - 1].position.width;
        positionedBar.position.y = this.tuneData[i - 1].position.y;
        positionedBar.position.width = minWidth;

        // check if next bar won't fit or there is no next bar. actually this doesn't work
        // if there's only one bar on the final line
        if (!this.tuneData[i + 1] || bar.position.x + minWidth + (this.tuneData[i + 1].notes.length * widthFactor) > renderWidth) {
          let extraSpace = (renderWidth - bar.position.x) - minWidth;
          let barsOnThisLine = 1;

          for (let j = i - 1; this.tuneData[j] && this.tuneData[j].position.y === bar.position.y; j -= 1) {
            barsOnThisLine += 1;
          }

          // if there will be extra space at the end because the next bar won't fit,
          // divide the extra space equally between all the bars on this line
          let spaceAdded = 0;
          for (let k = barsOnThisLine - 1; k >= 0; k -= 1) {
            const spaceToAdd = Math.floor(extraSpace / (k + 1));
            this.tuneData[i - k].position.x += spaceAdded;
            this.tuneData[i - k].position.width += spaceToAdd;
            extraSpace -= spaceToAdd;
            spaceAdded += spaceToAdd;
          }
        } else {
          positionedBar.position.width = minWidth;
        }
      }
      return positionedBar;
    });
  }

  // take positionedBars and draw it to the supplied VexFlow context
  drawToContext(context) {
    if (!this.tuneData) {
      return;
    }
    const { clef, meter, vexKeySignature } = this.tuneAttrs;
    let stave;
    let tabStave;
    this.tuneData.forEach((bar, index) => {
      if (index === 0) {
        // to "split" the first stave w/ invisible bar line so that the modifiers don't mess up the tab note alignment
        const clefsStave = new Stave(bar.position.x, bar.position.y, this.renderOptions.clefsAndSigsWidth, { right_bar: false });
        const clefsTabStave = new TabStave(bar.position.x, bar.position.y + 50, this.renderOptions.clefsAndSigsWidth, { right_bar: false });

        clefsStave.setContext(context);
        clefsStave.setClef(clef);
        clefsStave.setKeySignature(vexKeySignature);
        clefsStave.setTimeSignature(meter);
        clefsStave.draw();

        clefsTabStave.setContext(context);
        clefsTabStave.draw();

        bar.position.x += this.renderOptions.clefsAndSigsWidth;
        bar.position.width -= this.renderOptions.clefsAndSigsWidth;

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

      if (bar.volta.type != 0) { // 0 is the initialized value. could init to 1 which is the same as type NONE
        stave.setVoltaType(bar.volta.type, bar.volta.number.toString(), 10);
      }

      if (bar.keySig != "") {
        stave.setKeySignature(bar.keySig);
      }

      if (bar.repeats.includes(Vex.Flow.Barline.type.REPEAT_BEGIN)) {
        stave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
        tabStave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
      }
      if (bar.repeats.includes(Vex.Flow.Barline.type.REPEAT_END)) {
        stave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
        tabStave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);   
      }

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
