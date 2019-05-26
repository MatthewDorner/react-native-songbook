import { Navigation } from 'react-native-navigation';
import { YellowBox } from 'react-native';
import RegisterScreens from './src/screens';
import Database from './src/data-access/database';

// just importing so I can use madge to generate graph of dependencies and help visualize the
// project structure
import CurrentTune from './src/components/CurrentTune';
import TopBrowser from './src/components/TopBrowser';

YellowBox.ignoreWarnings([
  'Require cycle:',
  'Remote debugger'
]);

RegisterScreens();
Database.init(); // should I do something to wait until this completes before continuing?

// a provisional solution for allowing CollectionBrowser to update the state in CurrentTune.
// probably can use Redux to do the same thing but may not be worth it if this works. probably
// put class in another file.

// note: did not work when I created an object {} with these properties, but does work with a class and
// then creating the object as an instance, would be interesting to know why this is
const cb = function () {
  this.callback = undefined;
};
cb.prototype.setCallback = function (callback) {
  this.callback = callback;
};
const tuneChangeCallback = new cb();


Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
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
                      icon: require('./icons/music.png'), // credit "feathericons"
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
                      text: 'Collection Browser',
                      icon: require('./icons/book.png'), // would be cool to use closed book when you're not on collection tab, open book when you are on it
                      // selectedIcon: require('./book-open.png') // doesn't work?
                    }
                  }
                },
              } // end component
            ]// end children
          }
        }// end stack
        ]
      }
    }
  });
});
