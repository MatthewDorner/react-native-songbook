export default class Bar {
  constructor() {
    this.notes = [];
    this.tabNotes = [];
    this.beams = [];
    this.decorations = [];
    this.repeats = [];
    this.keySig = "";
    this.volta = {
      type: 0,
      number: 0
    };
    this.position = {
      x: 0,
      y: 0,
      width: 0
    };
  }
}
