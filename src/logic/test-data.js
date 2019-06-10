import Constants from './constants';
import Jigs from './jigs';

export default {
  testCollections: [
    {
      Name: 'Nottingham',
      Type: Constants.CollectionTypes.COLLECTION
    }, {
      Name: 'Others',
      Type: Constants.CollectionTypes.COLLECTION
    }, {
      Name: 'Etc',
      Type: Constants.CollectionTypes.COLLECTION
    }, {
      Name: 'Setlist A',
      Type: Constants.CollectionTypes.SETLIST
    }, {
      Name: 'Favorite Tunes',
      Type: Constants.CollectionTypes.SETLIST
    }, {
      Name: 'Third Setlist',
      Type: Constants.CollectionTypes.SETLIST
    }
  ],
  testTunes: Jigs,
  oldTestTunes: 'X: 2\n\
T:Barry\'s Favourite\n\
% Nottingham Music Database\n\
S:Mick Peat\n\
M:2/2\n\
K:D\n\
R:Reel\n\
A2|:"D"a3/2b/2a3/2g/2 f2(3def|"Em"g3/2a/2g3/2f/2 "A"e2A2|"D"f3/2g/2f3/2e/2 d2f2\\\n\
|"Em"B3/2c/2d3/2e/2 "A"c2A2|\n\
"D"a3/2b/2a3/2g/2 f2(3def|"Em"g3/2a/2g3/2f/2 "A"e2A2|\\\n\
"D"f3/2g/2f3/2e/2 d3/2e/2f3/2A/2|"G"B3/2d/2"A"d3/2c/2 "D"d2A2:|\n\
|:"G"B3/2A/2B3/2g/2 "D"d2A2|"Em"e3/2d/2e3/2f/2 "A"e2a2|\\\n\
"G"b3/2a/2(3gab "D"a3/2g/2(3fga|"E"f3/2e/2(3def "A"e2A2|\n\
"G"B3/2A/2B3/2g/2 "D"d2A2|"Em"e3/2d/2e3/2f/2 "A"e2a2|\\\n\
"G"b3/2a/2g3/2f/2 "A"a3/2g/2f3/2e/2|[1"D"d2f2 d2A2:|[2 d2f2d2||\n\
\n\
\n\
X: 3\n\
T:Black Boy\n\
% Nottingham Music Database\n\
S:Mick Peat\n\
M:2/4\n\
R:Jig\n\
L:1/4\n\
K:A\n\
|:"A"A "E"c/4B/4A/4G/4|"A"A/2c/2 e/2a/2|"E"g/2b/2 e/2d/2|"A"c/2AB/2|\\\n\
"A"c/2e/2 "B"^d/2f/2|"E"e/2ge/2|"B"f/2a/2 g/4f/4e/4^d/4|"E"e E:|\n\
|:"A"e/2=gf/2|"D"f/4e/4d/4c/4 d|"E"B/2df/2|"A"e/4d/4c/4B/4 c|"F#m"A/2ce/2|\\\n\
"Bm"d/4c/4B/4A/4 "E"G/2B/2|"Bm"E/2d/2 "E"c/4B/4A/4G/4|"A"A2:|\n\
M:6/8\n\
K:D\n\
|:"D"dd/2 cd/2|"A"e/2f/2e/2 e/2f/2g/2|"D"dd/2 "E"cd/2|"A"e/2c/2A/2 AA/2|\n\
"D"dd/2 cd/2|"A"e/2f/2d/2 e/2f/2g/2|"D"a/2f/2d/2 "A"g/2e/2c/2|[1 "D"dd/2 d A/2:|[2 "D"dd/2 de/2||\n\
|:"D"ff/2 f/2d/2f/2|"Em"gg/2 g/2e/2g/2|"D"ff/2 f/2d/2f/2|"A"e/2c/2A/2 Ag/2|\n\
"D"f/2a/2f/2 "Bm"d/2e/2f/2|"Em"g/2b/2g/2 "A"e/2f/2g/2|\\\n\
"D"a/2f/2d/2 "A"g/2e/2c/2|[1 "D"dd/2 d e/2:|[2"D" dd/2 d3/2||\n\
\n\
\n\
X: 4\n\
T:Black Tulip Hornpipe\n\
% Nottingham Music Database\n\
S:Mick Peat\n\
M:2/2\n\
R: Hornpipe\n\
K:G\n\
d2|:"G"B3/2g/2d3/2B/2 G3/2B/2d3/2B/2|"D"c3/2e/2a3/2g/2 f3/2d/2e3/2f/2|\\\n\
"G"B3/2g/2d3/2B/2 g3/2d/2B3/2d/2|"D"c3/2A/2d3/2A/2 e3/2A/2f3/2A/2|\n\
"G"g3/2d/2B3/2d/2 g3/2b/2a3/2g/2|"D"f3/2d/2A3/2d/2 f3/2a/2g3/2f/2|\\\n\
"C"e3/2d/2c3/2B/2 "D"c3/2e/2d3/2c/2|"G"B2G2 G2d2:|\n\
"D"ADBD cDdc|"G"BGcG ^cGdG|"D"ADBD cDd2|"G"edd^c d4|\n\
"D"ADBD cDdc|"G"BGcG ^cGd2|"C"ecgc "D"fcac|"G"g2b2 g4:|\n\
\n\
\n\
X: 5\n\
T:Bobbin Mill Reel\n\
% Nottingham Music Database\n\
S:Mick Peat\n\
M:4/4\n\
R:Reel\n\
L:1/4\n\
K:D\n\
A/2|:"D"d/2c/2d/2e/2 fA|"G"Be "A"cA|"D"d/2c/2d/2e/2 f/2e/2d/2c/2|"Em"Be "A"aA|\n\
"D"d/2c/2d/2e/2 f/2e/2d/2c/2|"G"Be "A"cA|"G"B/2c/2d/2B/2 "A"c/2d/2e/2c/2|\\\n\
"D"d2 dA:|\n\
"G"B/2A/2B/2c/2 "D"dA|"G"B/2A/2B/2c/2 "D"dA|\\\n\
"G"B/2A/2B/2c/2 "D"d/2c/2d/2e/2|"E"f/2e/2d/2f/2 "A"ea|"G"B/2A/2B/2c/2 "D"dA|\n\
"G"B/2A/2B/2c/2 "D"de/2f/2|"G"g/2f/2e/2g/2 "D"f/2e/2d/2f/2|\n\
[1"E"e/2d/2c/2d/2 "A"e2:|[2"A"e/2d/2c/2e/2 "D"d2||\n\
\n\
\n\
X: 6\n\
T:Bonnie Kate\n\
% Nottingham Music Database\n\
S:Mick Peat\n\
M:4/4\n\
R:Hornpipe\n\
L:1/4\n\
K:G\n\
f|:"G"g3/2a/2 "D"gf|"G"gd2e|"C"dc "D"BA|"G"BG2A|"G"B" Em"G2A/2B/2|\\\n\
"Am"c" D"A2B/2c/2|"G"Bd "C"cB| [1"D"Ad ef:|[2"D"A2 A2||\\\n\
"G"BG2A/2B/2|"D"cA "G7"dB|"C"ec2d/2e/2|"D"fzde/2f/2|\n\
"G"g3/2a/2 "Em"ge|"Bm"df "Em"gB|"Am"ce "D"d/2e/2d/2c/2|"G"BG G2:|\n\
\n\
\n\
X: 306\n\
T:Swallowtail\n\
% Nottingham Music Database\n\
S:EF\n\
Y:AB\n\
M:6/8\n\
K:Em\n\
R:Jig\n\
P:A\n\
E/2F/2|"Em"GEE BEE|"Em"GEE BAG|"D"FDD ADD|"D"d^cd AGF|\n\
"Em"GEE BEE|"Em"GEE B2^c|"D"d^cd AGF|"Em"GEE E2:|\n\
P:B\n\
B|"Bm"B^cd "Em"e2f|"Em"e2f edB|"Bm"B^cd "Em"e2f|"Em"edB "D"d3|\n\
"Bm"B^cd "Em"e2f|"Em"e2f edB|"D"d^cd AGF|"Em"GEE E2:|\n\
\n\
\n\
X:12\n\
T:The Irish Washerwoman\n\
R:Jig\n\
M:6/8\n\
L:1/8\n\
K:Gmaj\n\
dc|:"G"BGG DGG|BGB dcB|"Am"cAA EAA|cAc "D"edc|\n\
"G"BGG DGG|BGB dcB|"Am"cBc "D"Adc|[1"G"BGG Gdc:|[2"G"BGG Gga|]\n\
|:"G"bgg dgg|bgb bag|"D"aff dff|afa agf|\n\
"C"egg "G"dgg|"C"cgg "G"B2B|"Am"cBc "D"Adc|[1"G"BGG Gga:|[2"G"BGG G3|]\n\
\n\
\n\
X:1\n\
T:Accidentals\n\
M:C\n\
K:C\n\
__A _A =A ^A ^^A|]\n\
X: 307\n\
T:Sweets of May\n\
% Nottingham Music Database\n\
Y:AABBCC\n\
S:Kevin Briggs, via EF\n\
M:6/8\n\
K:G\n\
R:Jig\b\
P:A\n\
|:d/2c/2|"G"B2G "D7"AFD|"G"GAG "D7"Gdc|"G"B2G GAB|"C"cBc "D7"d2c|\n\
"G"B2G "D7"AFD|"G"GAG "D7"Gdc|"G"B2G "D7"AFD|"G"G3 -G2:|\n\
P:B\n\
|:A|"Am"ABA A2G|"Em"E2F G2"E"^G|"Am"ABA c2d|"Dm"e2d "E7"c2B|\n\
"Am"ABA A2G|"Em"E2F G2"E"^G|"Am"A2A "G"BAG|"Am"A3 -A2:|\n\
P:C\n\
|:(3A/2B/2c/2|"D"d3 dcd|"D"D3 DED|"Am"c3 cBc|"D7"D3 DEF|"G"G2D "D7/a"G2A|\\\n\
"G/b"B2G "C"B2c|"D7"d2D DEF|"G"G3 -G2:|'
};
