const metroDefault = require('metro-config/src/defaults/defaults.js');

module.exports = {
  resolver: {
    sourceExts: metroDefault.sourceExts.concat(['md']),
  },
};
