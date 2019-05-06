import React, { Component } from 'react';
// import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { TabStave } from 'vexflow/src/tabstave';
import { StaveNote } from 'vexflow/src/stavenote';
import { TabNote } from 'vexflow/src/tabnote';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import { Beam } from 'vexflow/src/beam';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import VexUtils from '../vex-utils';
import ABCJS from 'abcjs';
import Vex from 'vexflow';

import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

export default class VexFlowScore extends Component {
  constructor(props) {
    super(props);
    this.runVexFlowCode = this.runVexFlowCode.bind(this);
  }

  runVexFlowCode(context) {
    context.setViewBox(0, 140, 505, 500);

    console.log('IN RUNVEXFLOWCODE, TUNE WAS: ' + this.props.tune);

    // GET THE PARSED OBJECTS AND PROPERTIES
    let parsedObject = ABCJS.parseOnly(this.props.tune);
    let lines = parsedObject[0].lines;
    let musicalObjects = parsedObject[0].lines.map(function(line, i) {
      return line.staff[0].voices[0]
    }).reduce((acc, val) => acc.concat(val), []);

    // GET THE TUNE DETAILS
    var meter = VexUtils.getMeter(this.props.tune);
    var keySignature = VexUtils.convertKeySignature(lines[0].staff[0].key);
    var clef = lines[0].staff[0].clef.type;

    // INITIALIZE VARIABLES
    var currentStaveNotes = [];
    let currentTabNotes = [];
    let nextBarDecorations = [];
    let bars = [];
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

    console.log('got musicalObjects, was: ');
    console.log(musicalObjects);

    musicalObjects.forEach((obj, i) => {
      switch (obj.el_type) {
        case "note":

          if (obj.rest) {
            break; // TODO implement
          }

          let keys = VexUtils.getKeys(obj.pitches); //don't need key here?
          let accidentals = VexUtils.getAccidentals(obj.pitches);

          let noteDuration = obj.duration;
          let isDotted = false;

          for (var i = 0; i < 5; i++) {
            let pow = Math.pow(2, i);
            if (obj.duration == 1/pow + (1/pow) * .5) {
              noteDuration = 1/pow;
              isDotted = true;
            }
          }
          let duration = (1/noteDuration).toString();

          let noteToAdd = new StaveNote({ clef: clef, keys: keys, duration: duration });
          if (isDotted) {
            noteToAdd.addDotToAll();
          }
          accidentals.forEach((accidental, i) => {
            if (accidental) {
              noteToAdd.addAccidental(i, new Vex.Flow.Accidental(accidental));
            }
          });

          if (obj.chord) {
            noteToAdd.addModifier(0, new Vex.Flow.Annotation(obj.chord[0].name) //why [0]
              .setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.TOP));
          }

          currentStaveNotes.push(noteToAdd);

          /* TAB */
          let tabNoteToAdd = new TabNote({
            positions: VexUtils.getTabPosition(keys, accidentals, lines[0].staff[0].key),
            duration: duration
          });
          if (isDotted) {
            tabNoteToAdd.addDot();
          }
          currentTabNotes.push(tabNoteToAdd);

          break;
        case "bar":

          /*
            there is a problem with the order of creating new volta, evaluating existing volta,
            and creating the bar. if we don't check voltas before we break due to multiple bars,
            we could possibly miss a volta marker if it's part of a series of multiple bars.

            maybe we should collapse multiple bars into one and add their modifiers together
            before even getting to this point. it would make the multiple bar thing
            null.
          */

          // if (musicalObjects[i+1] && musicalObjects[i+1].el_type == "bar") {
          //   break;
          // }

          let currentBar = new Bar();

          if (inVolta != 0 && !obj.endEnding) { // and isn't ending right now
            if (barVoltaStarted == bars.length-1) { // started last bar
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
          } else if (inVolta != 0) { // and IS ending right now
            if (barVoltaStarted == bars.length-1) { // started last bar and is ending this one
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

          // handle decorations that must be applied to this bar from the 
          // start barline (current one is the end barline)
          nextBarDecorations.forEach(function(decoration) {
            currentBar.decorations.push(decoration);
          });
          nextBarDecorations = [];

          if (obj.type == "bar_right_repeat") {
            currentBar.decorations.push(Vex.Flow.Barline.type.REPEAT_END);
          }

          /*
            so auto beaming somehow sets the stem-direction. but I thought we got beaming from
            abcjs.. yeah, we do. I was using it but somehow lost it in refactor. I want to use that,
            but calculate stem direction based off it (because beam groups must share stem direction)

            it will be best to calculate the stem direction of the beam group by the first... note
            since that will probably be the one that may have a chord symbol above it, and want to make
            sure that the stem is pointing down if necessary if a chord symbol is above it
          */

          // ONLY WANT TO USE THIS CODE FOR 6/8 TUNES
          // var beams = VexUtils.generateBeams(currentStaveNotes);
          // if (beams.length == 0) {
          //   var beams = Beam.generateBeams(currentStaveNotes);
          // }
          var beams = Beam.generateBeams(currentStaveNotes);

          currentBar.beams = beams;
          currentBar.notes = currentStaveNotes;
          currentBar.tabNotes = currentTabNotes;

          if (obj.type == "bar_left_repeat") {
            nextBarDecorations.push(Vex.Flow.Barline.type.REPEAT_BEGIN);
          }

          currentStaveNotes = [];
          currentTabNotes = [];
          bars.push(currentBar);

          break;
      }      
    });

    // SINCE I'M MULTIPLYING BY WIDTH FACTOR, BARS WITH 0 NOTES END UP WITH 0 WIDTH. THE INTERESTING EFFECT
    // IS THAT THIS HIDES THE PROBLEM OF DOUBLE BARLINES, SINCE THE MEASURE IS 0 WIDTH. DO I WANT IT THIS WAY?
    let X_OFFSET = 3;
    let WIDTH_FACTOR = 25;
    let LINE_HEIGHT = 190;
    let CLEFS_AND_SIGS_WIDTH = 100;
    let RENDER_WIDTH = 500;

    bars.forEach(function(bar, i) {

      let idealWidth = bar.notes.length * WIDTH_FACTOR;
      if (idealWidth > RENDER_WIDTH) {
        idealWidth = RENDER_WIDTH;
      }

      if (i == 0) { // first bar
        bar.x = X_OFFSET;
        bar.y = 0;
        bar.width = idealWidth + CLEFS_AND_SIGS_WIDTH;
      } else if (bars[i-1].x + bars[i-1].width >= RENDER_WIDTH) { // first bar on a new line
        bar.x = X_OFFSET;
        bar.y = bars[i-1].y + LINE_HEIGHT;
        bar.width = idealWidth;
      } else { // bar on an incomplete line
        bar.x = bars[i-1].x + bars[i-1].width;
        bar.y = bars[i-1].y;
        bar.width = idealWidth;

        // check if next bar won't fit or there is no next bar. actually this is supposed to
        // work when there's no next bar but it doesn't work...
        if (!bars[i+1] || bar.x + idealWidth + (bars[i+1].notes.length * WIDTH_FACTOR) > RENDER_WIDTH) {
          let extraSpace = (RENDER_WIDTH - bar.x) - idealWidth;
          let barsOnThisLine = 1;

          for (let j = i-1; bars[j] && bars[j].y == bar.y; j--) {
            barsOnThisLine ++;
          }

          // if there will be extra space because the next bar won't fit,
          // divide the extra space equally between all the bars on this line
          let spaceAdded = 0;
          for (let k = barsOnThisLine - 1; k >= 0; k--) {
            let spaceToAdd = Math.floor(extraSpace / (k + 1));
            bars[i-k].x += spaceAdded;
            bars[i-k].width += spaceToAdd;
            extraSpace -= spaceToAdd;
            spaceAdded += spaceToAdd;
          }
          
        } else {
          bar.width = idealWidth;
        }
      }
    });

    /*
      so want to separate that bar into two bars...
      and the positioning of the bar is done above,
      but the rendering must be done below.

      when the positioning is done, even then the number
      of bars has been set. easiest thing? to cut it into
      two bars at the very end when it's being rendered...
    */

    bars.forEach(function(bar, index) {

      // let stave = new Stave(bar.x, bar.y, bar.width);
      // stave.setContext(context);
      // let tabStave = new TabStave(bar.x, bar.y + 50, bar.width);
      // tabStave.setContext(context);

      if (index == 0) {

        // to "split" the first stave secretly so that the modifiers don't mess up the tab note alignment
        let clefsStave = new Stave(bar.x, bar.y, Math.floor(bar.width / 2), { right_bar: false });
        let clefsTabStave = new TabStave(bar.x, bar.y + 50, Math.floor(bar.width / 2), { right_bar: false });
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

      if (bar.volta.type != 0) { // it's not type 0 which means not there...
        stave.setVoltaType(bar.volta.type, bar.volta.number.toString(), 10);
      }

      bar.decorations.forEach(function(decoration) {
        switch (decoration) {
          case Vex.Flow.Barline.type.REPEAT_BEGIN: //these are integer constants...
            stave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
            tabStave.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
            break;
          case Vex.Flow.Barline.type.REPEAT_END:
            stave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
            tabStave.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
            break;
        }
      });

      // if (index == 0) {
      //   stave.setClef(clef);
      //   stave.setKeySignature(keySignature);
      //   stave.setTimeSignature(meter);
      // }    

      // WHAT DOES VOICE EVEN DO? it seems like I wasn't doing anything wiht it before.
      let voice = new Voice({ num_beats: meter.charAt(0), beat_value: meter.charAt(2)});
      voice.setStrict(false);
      voice.addTickables(bar.notes);

      // DRAW
      stave.draw();
      Formatter.FormatAndDraw(context, stave, bar.notes);
      bar.beams.forEach((b) => { b.setContext(context).draw() });
      tabStave.draw();
      Formatter.FormatAndDraw(context, tabStave, bar.tabNotes);
    });
  }

  render() {
    let context = new ReactNativeSVGContext(NotoFontPack, { width: Dimensions.get('window').width * .90, height: Dimensions.get('window').height * 1.5 });
    this.runVexFlowCode(context);

    return (
      <View style={styles.container}>
        {context.render()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

