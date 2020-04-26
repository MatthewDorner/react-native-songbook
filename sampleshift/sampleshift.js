const { exec } = require('child_process');

// this should be imported from Constants module
const sampleNotes = [
  'c3',
  'cs3',
  'd3',
  'ds3',
  'e3',
  'f3',
  'fs3',
  'g3',
  'gs3',
  'a3',
  'as3',
  'b3',
  'c4',
  'cs4',
  'd4',
  'ds4',
  'e4',
  'f4',
  'fs4',
  'g4',
  'gs4',
  'a4',
  'as4',
  'b4',
  'c5',
  'cs5',
  'd5',
  'ds5',
  'e5',
  'f5',
  'fs5',
  'g5',
  'gs5',
  'a5',
  'as5',
  'b5',
  'c6'
];

const SEMITONE = 1.05946;

/* 
  This node.js script takes an input.wav which should be note C3 and creates a set of
  repitched samples chromatically from C3 to C6.

  input.wav of C3 should be placed in this 'sampleshift' folder.

  sox[global-options][format-options]infile1[[format-options]infile2]... [format-options]outfile[effect[effect-options]] ...

  speed == adjust pitch and tempo together.
  pitch == just pitch shift
  sox slow.aiff fixed.aiff speed 1.027

  1 semitone === 5.946 % change
*/


function shift(r) {
  // r 0 will just leave it the same, so r 0 should create the output for c3
  // const speed = SEMITONE ** r; // if using speed..
  const pitch = 100 * r;
  const noteId = sampleNotes[r];

  exec(`sox input.wav ${noteId}.wav pitch ${pitch}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`${stdout}`);
    if (r < sampleNotes.length - 1) {
      shift(r + 1);
    }
  });
}

shift(0);
