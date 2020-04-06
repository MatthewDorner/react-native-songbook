const { exec } = require('child_process');

/* 
  This node.js script takes an input.wav which should be note C3 and creates a set of
  repitched samples chromatically from C3 to C6.

  input.wav should be placed in this 'sampleshift' folder.

  sox[global-options][format-options]infile1[[format-options]infile2]... [format-options]outfile[effect[effect-options]] ...

  speed == adjust pitch and tempo together.
  sox slow.aiff fixed.aiff speed 1.027

  1 semitone === 5.946
*/


// once callback runs, then we know we can use the output file... so will need to be recursive again??
exec("ls -la", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
