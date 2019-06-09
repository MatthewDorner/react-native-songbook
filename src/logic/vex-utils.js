import { Beam } from 'vexflow/src/beam';
import Vex from 'vexflow';
import NoteUtils from './note-utils';
import { StaveNote } from 'vexflow/src/stavenote';
import { TabNote } from 'vexflow/src/tabnote';

export default {

  /* this is to get the notes to group together correctly in jig timing, although there was a post
    suggesting that the automatic beaming would work
    for compound signatures (such as jig I think) but
    it doesn't seem to. so instead I was going to use this code and if it doesn't find any beams of
    3 eighth notes in either the first or second half of the measure, it will run the automatic
    beaming code ... this code only works right in 6/8 time
    though and I need all time signatures to work */
  generateBeams(notes) {
    const beams = [];
    if (notes[0] && notes[0].duration === '8' && notes[1] && notes[1].duration === '8' && notes[2] && notes[2].duration === '8') {
      beams.push(new Beam([notes[0], notes[1], notes[2]]));
    }
    const l = notes.length;
    if (notes[l - 1] && notes[l - 1].duration === '8' && notes[l - 2] && notes[l - 2].duration === '8' && notes[l - 3] && notes[l - 3].duration === '8') {
      beams.push(new Beam([notes[l - 1], notes[l - 2], notes[l - 3]]));
    }
    return beams;
  },

  /*
        convert the keys in vex format such as 'd/4' into guitar tab positions of string, fret
        needs to be updated to act on the entire array not just keys[0]

        TODO: need to take into account that if there's an accidental earlier in the bar, it applies to all notes in that position
        in the bar (if a C is marked #, later Cs in the bar, although they won't
        have an accidental, will also be sharped,
        unless they have a natural accidental) ALSO, IF AN ACCIDENTAL IS
        APPLIED THAT is already in the key signature,
        such as if C# was already in key signature but a C had a #
        accidental, it wouldn't do anything
    */
  getTabPosition(keys, accidentals, keySignature) {
    const diatonicNote = NoteUtils.getDiatonicFromLetter(keys[0]);
    let chromaticNote = NoteUtils.getChromaticFromLetter(keys[0]);

    // need double sharp and flat.. and natural actually
    let noteIsSharped = false;
    let noteIsFlatted = false;

    // encode 'sharp', 'flat', 'dblsharp', 'dblflat' as constants like +1, -1, +2, -2
    // now USE THIS IN VexUtils:
    // getSemitonesForAccidental(accidental) {
    //   const semitones = {
    //     sharp: 1,
    //     flat: -1,
    //     dblsharp: 2,
    //     dblflat: -2,
    //     natural: 0
    //   };
    //   return semitones[accidental];
    // }

    keySignature.accidentals.forEach((accidental) => {
      if (diatonicNote === NoteUtils.getDiatonicFromLetter(accidental.note)) {
        switch (accidental.acc) {
          case 'sharp':
            chromaticNote += 1;
            noteIsSharped = true;
            break;
          case 'flat':
            chromaticNote -= 1;
            noteIsFlatted = true;
            break;
          default:
            break;
        }
      }
    });

    if (accidentals[0]) {
      switch (accidentals[0]) {
        case 'b':
          if (!noteIsFlatted) {
            chromaticNote -= 1;
          }
          break;
        case 'bb':
          chromaticNote -= 2;
          break;
        case '#':
          if (!noteIsSharped) {
            chromaticNote += 1;
          }
          break;
        case '##':
          chromaticNote += 2;
          break;
        default:
          break;
      }
    }

    const octave = keys[0].charAt(2);
    const noteNumber = octave * 12 + chromaticNote;
    const lowestNoteNumber = 28; // number for e2, lowest note on guitar
    let fretsFromZero = noteNumber - lowestNoteNumber;
    // "guitar plays octave lower than it reads" so actually e3 will be the lowest supported
    fretsFromZero -= 12;

    // correct for the major third interval between B and G strings
    if (fretsFromZero >= 19) {
      fretsFromZero += 1;
    }

    let left = fretsFromZero % 5;
    let top = 6 - (Math.floor((fretsFromZero) / 5)); // math.floor?

    /*
            i eventually want to handle it so that if there are a bunch of notes up higher
            and mixed with lower notes, it'll put them all together in a higher position for
            easier playing. then again most of these songs won't have that and those notes
            will be pretty high above the treble clef..
        */

    if (top < 1) {
      left += (1 - top) * 5;
      top = 1;
    }
    return [{ str: top, fret: left }];
  },

  /* used to convert the key sig returned from abcjs parser into what VexFlow takes.
    */
  convertKeySignature(abcKey) {
    const { keySpecs } = Vex.Flow.keySignature;
    if (abcKey.accidentals.length === 0) {
      return 'C';
    }
    for (const key in keySpecs) {
      if (keySpecs[key].num == abcKey.accidentals.length) {
        if (abcKey.accidentals[0].acc == 'sharp' && keySpecs[key].acc == '#'|| abcKey.accidentals[0].acc == 'flat' && keySpecs[key].acc == 'b') {
          return key;
        }
      }
    }
    return false;
  },
  
  generateVexNotes(obj, tuneAttrs) {
    // PROCESS PROPERTIES INTO VEXFLOW-FRIENDLY FORMS
    const keys = this.getKeys(obj.pitches);
    const accidentals = this.getAccidentals(obj.pitches);
    const { duration, isDotted } = this.getVexDuration(obj.duration);

    // CREATE AND ADD MODIFIERS TO STAVE NOTE
    const noteToAdd = new StaveNote({
      clef: tuneAttrs.clef, keys, duration, auto_stem: true
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
      positions: this.getTabPosition(keys, accidentals, tuneAttrs.abcKeySignature),
      duration
    });
    if (isDotted) { tabNoteToAdd.addDot(); }

    return { noteToAdd, tabNoteToAdd };
  },

  /*
        since the built in functions in abc parsed object doesn't seem to work
    */
  getMeter(abcString) {
    const lines = abcString.split('\n');
    const meterLine = lines.filter(line => line.charAt(0) === 'M');
    if (meterLine[0]) {
      // apparently it may also be such as "M: ", with a space. although I could
      // handle this at some other point, whenever I clean whitespace
      return meterLine[0].slice(2, meterLine[0].length).trim();
    }
    return ''; // fix and make consistent null checks, etc...
  },

  getKeys(abcPitches) {
    // middle B in treble clef is abc pitch number 6
    const keys = [];
    abcPitches.forEach((pitch) => {
      const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
      const octave = (Math.floor(pitch.pitch / 7)); // this not right
      const vexOctave = octave + 4;
      const note = pitch.pitch - (octave * 7);
      keys.push(`${notes[note]}/${vexOctave.toString()}`);
    });

    return keys;
  },

  // getVolta(obj, length, barVoltaStarted, inVolta) {
  getVolta(obj) {
    // this won't work for figuring out MID voltas but they probably won't occur anyway...
    // don't really want to keep track of stuff between iterations
    if (obj.startBarLine.startEnding && obj.endBarLine.endEnding) {
      return {
        number: obj.startBarLine.startEnding,
        type: Vex.Flow.Volta.type.BEGIN_END
      };
    } else if (obj.startBarLine.startEnding) {
      return {
        number: obj.startBarLine.startEnding,
        type: Vex.Flow.Volta.type.BEGIN
      };  
    } else if (obj.endBarLine.endEnding) {
      return { // not going to be able to know the number
        number: 0,
        type: Vex.Flow.Voice.type.END
      };
    } else {
      return {
        number: 0,
        type: 0
      };
    }
  },

  getVexDuration(abcDuration) {
    let noteDuration = abcDuration;
    let isDotted = false;

    for (let j = 0; j < 5; j += 1) {
      const pow = 2 ** j;
      if (abcDuration === 1 / pow + (1 / pow) * 0.5) {
        noteDuration = 1 / pow;
        isDotted = true;
      }
    }
    const duration = (1 / noteDuration).toString();
    return { duration, isDotted };
  },

  getAccidentals(abcPitches) {
    /*
            ACCIDENTALS

                so it seems like they're both working the same
                way and I don't even need to calculate
                accidentals. though I DO NEED TO calculate them when it comes to guitar tab, mainly
                sending the accidentals into the getTabPosition so it can take them into account

            ABCJS:
                pitch is {accidental: "sharp", pitch: 5, verticalPos: 5}

            VEXFLOW:
                new VF.StaveNote({clef: "treble", keys: ["c/5", "eb/5", "g#/5"], duration: "q" }).
                addAccidental(1, new VF.Accidental("b")).
                addAccidental(2, new VF.Accidental("#")).addDotToAll()
                ^ NOTE THAT THEY'RE INCLUDING THE ACCIDENTALS IN THE
                keys[], does it make any difference
                if I do that?
        */

    const accidentals = [];

    abcPitches.forEach((pitch) => {
      const accidental = NoteUtils.getVexAccidental(pitch.accidental);
      accidentals.push(accidental);
    });

    return accidentals;
  }
};
