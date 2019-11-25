import { Navigation } from 'react-native-navigation';
import { YellowBox } from 'react-native';
import RegisterScreens from './src/screens';
import DBOperations from './src/data-access/db-operations';

const musicIcon = require('./icons/music.png');
const bookIcon = require('./icons/book.png');
const textIcon = require('./icons/text.png');

YellowBox.ignoreWarnings([
  'Require cycle:',
  'Remote debugger'
]);

RegisterScreens();

// note: did not work when I created an object {} with these properties, but does work
// with a class and then creating the object as an instance, would be interesting
// to know why this is
const Cb = function () {
  this.callback = undefined;
};
Cb.prototype.setCallback = function (callback) {
  this.callback = callback;
};
const tuneChangeCallback = new Cb();


Navigation.events().registerAppLaunchedListener(() => {
  DBOperations.init().then(() => {
    Navigation.setRoot({
      root: {
        bottomTabs: {
          options: {
            bottomTabs: {
              currentTabIndex: 2
            },
          },
          children: [{
            stack: {
              id: 'CurrentTuneStack',
              options: {
                topBar: {
                  visible: false,
                  height: 0,
                }
              },
              children: [
                {
                  component: {
                    name: 'CurrentTune',
                    id: 'CurrentTune', // needed for mergeoptions to toggle tabbar visibility
                    passProps: {
                      tuneChangeCallback
                    },
                    options: {
                      bottomTab: {
                        text: 'Current Tune',
                        icon: musicIcon, // credit "feathericons"
                      },
                      bottomTabs: {
                        drawBehind: true
                      }
                    }
                  },
                },
              ]
            }
          }, // end stack
          { // begin stack
            stack: {
              id: 'BrowserStack',
              options: {
                topBar: {
                  visible: false,
                  height: 0,
                }
              },
              children: [
                { // begin component
                  component: {
                    name: 'TopBrowser',
                    passProps: {
                      tuneChangeCallback
                    },
                    options: {
                      bottomTab: {
                        text: 'Browser',
                        icon: bookIcon,
                        // would be cool to use closed book when you're not on collection tab, open book when you are on it:
                        // selectedIcon: require('./icons/book-open.png') // doesn't work?
                      }
                    }
                  },
                } // end component
              ]// end children
            }
          }, // end stack
          { // begin stack
            stack: {
              id: 'InfoStack',
              options: {
                topBar: {
                  visible: false,
                  height: 0,
                }
              },
              children: [
                { // begin component
                  component: {
                    name: 'Info',
                    options: {
                      bottomTab: {
                        text: 'Info',
                        icon: textIcon
                      }
                    }
                  },
                } // end component
              ]// end children
            }
          }]
        }
      }
    });
  });
});
