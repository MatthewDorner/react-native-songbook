# react-native-songbook

[![https://www.youtube.com/watch?v=3JmwLJkAOxk](https://img.youtube.com/vi/3JmwLJkAOxk/0.jpg)](https://www.youtube.com/watch?v=3JmwLJkAOxk)

**Update 4/39/21: App v1.1.1 update is released on Google Play**

**Update 12/6/19: App is now released on Google Play as [ABC Songbook](https://play.google.com/store/apps/details?id=com.reactnativesongbook)**

React Native app for viewing music in [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation). This is an app for musicians who want to learn fiddle tunes and other traditional folk music.

Uses [abcjs](https://github.com/paulrosen/abcjs) to parse and [VexFlow](https://github.com/0xfe/vexflow) to render, facilitated by my library [abcjs-vexflow-renderer](https://github.com/matthewdorner/abcjs-vexflow-renderer).

Current features:
- Generate sheet music and tablature from ABC notation
- Tabs for guitar, banjo, mandolin, fiddle fingerings, tin whistle, harmonica
- Reflow for portrait vs. landscape
- Audio playback
- SQLite database with [over 1000 tunes included](https://github.com/jukedeck/nottingham-dataset)
- Import ABC files into database
- Database title search and filter on key and rhythm type
- Features for managing collections: create, edit, move, etc
