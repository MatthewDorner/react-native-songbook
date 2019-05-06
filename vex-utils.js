import NoteUtils from './note-utils';
import { Beam } from 'vexflow/src/beam';
import Vex from 'vexflow';

export default {

    /* this is to get the notes to group together correctly in jig timing, although there was a post
    suggesting that the automatic beaming would work for compound signatures (such as jig I think) but
    it doesn't seem to. so instead I was going to use this code and if it doesn't find any beams of 
    3 eighth notes in either the first or second half of the measure, it will run the automatic
    beaming code ... this code only works right in 6/8 time though and I need all time signatures to work */
    generateBeams(notes) {
        let beams = [];
        if (notes[0] && notes[0].duration == "8" && notes[1] && notes[1].duration == "8" && notes[2] && notes[2].duration == "8") {
            beams.push(new Beam([notes[0], notes[1], notes[2]]));
        }
        let l = notes.length;
        if (notes[l - 1] && notes[l - 1].duration == "8" && notes[l - 2] && notes[l - 2].duration == "8" && notes[l - 3] && notes[l - 3].duration == "8") {
            beams.push(new Beam([notes[l - 1], notes[l - 2], notes[l - 3]]));
        }
        return beams;
    },

    /*
        convert the keys in vex format such as 'd/4' into guitar tab positions of string, fret
        needs to be updated to act on the entire array not just keys[0]
    */
    getTabPosition(keys, accidentals, keySignature) {
        let diatonicNote = NoteUtils.getDiatonicFromLetter(keys[0]);
        let chromaticNote = NoteUtils.getChromaticFromLetter(keys[0]);

        // need double sharp and flat.. and natural actually
        let noteIsSharped = false;
        let noteIsFlatted = false;

        keySignature.accidentals.forEach(function(accidental) {
            if (diatonicNote == NoteUtils.getDiatonicFromLetter(accidental.note)) {
                switch (accidental.acc) {
                    case "sharp":
                        chromaticNote++;
                        noteIsSharped = true;
                        break;
                    case "flat":
                        chromaticNote--;
                        noteIsFlatted = true;
                        break;
                }
            }
        });

        /*
            sharp doesn't just raise whatever the note is... if a note is shown as sharp and it's already
            listed in the key signature, it doesn't do anything...
        */
        if (accidentals[0]) {
            switch (accidentals[0]) {
                case "b":
                    if (!noteIsFlatted) {
                        chromaticNote -= 1;
                    }
                    break;
                case "bb":
                    chromaticNote -= 2;
                    break;
                case "#":
                    if (!noteIsSharped) {
                        chromaticNote += 1;
                    }
                    break;
                case "##":
                    chromaticNote += 2;
                    break;
            }
        }

        let octave = keys[0].charAt(2);
        let noteNumber = octave * 12 + chromaticNote;
        let lowestNoteNumber = 28; // number for e2, lowest note on guitar
        let fretsFromZero = noteNumber - lowestNoteNumber;
        fretsFromZero -= 12; // "guitar plays octave lower than it reads" so actually e3 will be the lowest supported

        // correct for the major third interval between B and G strings
        if (fretsFromZero >= 19) {
            fretsFromZero++;
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
        let keySpecs = Vex.Flow.keySignature.keySpecs;
        if (abcKey.accidentals.length == 0) {
            return "C";
        }
        for(var key in keySpecs){
            if (keySpecs[key].num == abcKey.accidentals.length) {
                if (abcKey.accidentals[0].acc == "sharp" && keySpecs[key].acc == "#" || abcKey.accidentals[0].acc == "flat" && keySpecs[key].acc == "b") {
                    return key;
                }
            }
        }
    },

    /*
        since the built in functions in abc parsed object doesn't seem to work
    */
    getMeter(abcString) {
        let lines = abcString.split('\n');
        let meterLine = lines.filter((line) => {
            return line.charAt(0) == "M";
        });
        return meterLine[0].slice(2, meterLine[0].length).trim();
    },

    getKeys(abcPitches) {
        keys = [];
        abcPitches.forEach((pitch) => {
            let notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
            let octave = (Math.floor(pitch.pitch / 7)); // this not right
            let vexOctave = octave + 4;
            let note = pitch.pitch - (octave * 7)

            // got pitch.pitch as: 6 (B )
            // vex-utils.js:156 octave: 1, vexOctave: 5, note: -6

            // console.log('****');
            // console.log('got pitch.pitch as: ' + pitch.pitch);
            // console.log('pushing note: ' + notes[note] + '/' + vexOctave.toString());
            keys.push(notes[note] + '/' + vexOctave.toString());
        });

        return keys;
    },

    getAccidentals(abcPitches) {
        /*
            ACCIDENTALS

                so it seems like they're both working the same way and I don't even need to calculate 
                accidentals. though I DO NEED TO calculate them when it comes to guitar tab, mainly
                sending the accidentals into the getTabPosition so it can take them into account

            ABCJS:
                pitch is {accidental: "sharp", pitch: 5, verticalPos: 5}

            VEXFLOW:
                new VF.StaveNote({clef: "treble", keys: ["c/5", "eb/5", "g#/5"], duration: "q" }).
                addAccidental(1, new VF.Accidental("b")).
                addAccidental(2, new VF.Accidental("#")).addDotToAll()
                ^ NOTE THAT THEY'RE INCLUDING THE ACCIDENTALS IN THE keys[], does it make any difference
                if I do that?
        */

        let accidentals = [];

        abcPitches.forEach((pitch) => {
            let accidental = false;
            if (pitch.accidental) {
                switch (pitch.accidental) {
                    case "sharp":
                        accidental = "#";
                    break;
                    case "flat":
                        accidental = "b";
                    break;
                    case "dblsharp":
                        accidental = "##";
                    break;
                    case "dblflat":
                        accidental = "bb";
                    break;
                    case "natural":
                        accidental = "n";
                    break;
                }
            }
            accidentals.push(accidental);
        });

        return accidentals;
    }
}

