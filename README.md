# react-native-songbook

**Update 12/6/19: App is now released on Google Play as [ABC Songbook](https://play.google.com/store/apps/details?id=com.reactnativesongbook)**

React Native app for viewing music in [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation).

Uses [abcjs](https://github.com/paulrosen/abcjs) to parse and [VexFlow](https://github.com/0xfe/vexflow) to render, facilitated by my library [abcjs-vexflow-renderer](https://github.com/matthewdorner/abcjs-vexflow-renderer).

Current features:
- Generate sheet music and guitar tablature from ABC notation
- SQLite database with [default data](https://github.com/jukedeck/nottingham-dataset)
- Database title search and filter on key and rhythm type
- Reflow for portrait vs. landscape
- Import ABC songbooks into database
- Features for managing songs collection: create, edit, move, etc
