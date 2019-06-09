# react-native-songbook

React Native app for viewing music in [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation).

Uses [abcjs](https://github.com/paulrosen/abcjs) to parse and [VexFlow](https://github.com/0xfe/vexflow) to render.

![screenshot](https://matthewdorner.github.io/reactnativesongbook.png)

Current features:
- Generate sheet music and guitar tablature from ABC notation
- SQLite database with [test data](https://github.com/jukedeck/nottingham-dataset), search and filter
- Reflow for portrait vs. landscape.

Future features:
- Display options including auto-scroll, zoom, note density
- Import ABC songbooks into database
- Features for managing songs collection: create, edit, move, etc.

ABC features currently supported:
- Repeat signs
- Multiple endings
- Chord symbols

ABC features not supported:
- Multiple voices
- Lyrics
