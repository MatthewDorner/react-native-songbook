export default {
    // to convert notes between a-g, 0-7 and 0-11

    getDiatonicFromLetter(letter) {
        let diatonic = letter.charCodeAt(0) - 97;

        // change from a being 0 to c being 0
        if (diatonic < 2) {
            diatonic += 5;
        } else {
            diatonic -= 2;
        }
        return diatonic;
    },

    getChromaticFromLetter(letter) {
        let diatonic = this.getDiatonicFromLetter(letter);
        return this.getChromaticFromDiatonic(diatonic);
    },

    getChromaticFromDiatonic(diatonic) {
        switch (diatonic) {
            case 0: // c
                return 0;
            case 1: // d
                return 2;
            case 2: // e
                return 4;
            case 3: // f
                return 5;
            case 4: // g
                return 7;
            case 5: // a
                return 9;
            case 6: // b
                return 11;
        }
    },

    getVexAccidental(accidental) {
        // these should be done better in JS by using key-value lookups instead of switch statement?
        switch (accidental) {
            case "sharp":
                return "#";
            case "flat":
                return  "b";
            case "dblsharp":
                return "##";
            case "dblflat":
                return "bb";
            case "natural":
                return "n";
            default:
                return false;
        }
    }
}
