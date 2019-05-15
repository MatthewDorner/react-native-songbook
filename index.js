import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';
import { YellowBox } from 'react-native';
import Database from './database';

import SampleTune from './sample-tune'; // just a default tune so the component will load. TODO: load as blank instead or don't even make the tab appear when app starts up

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

registerScreens();
Database.init(); // should I do something to wait until this completes before continuing?

// a provisional solution for allowing CollectionBrowser to update the state in CurrentTune.
// probably can use Redux to do the same thing but may not be worth it if this works. probably
// put class in another file.

// note: did not work when I created an object {} with these properties, but does work with a class and
// then creating the object as an instance, would be interesting to know why this is
let cb = function() {
  this.callback = undefined;
};
cb.prototype.setCallback = function(callback) {
  this.callback = callback;
}
let tuneChangeCallback = new cb();


Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
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
                      tuneChangeCallback: tuneChangeCallback,
                      tune: SampleTune
                    },
                    options: {
                      bottomTab: {
                        text: 'Current Tune',
                        icon: require('./icon.png'),
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
            children: [



          { //begin component
            component: {
              name: 'TopBrowser',
              passProps: {
                tuneChangeCallback: tuneChangeCallback
              },
              options: {
                bottomTab: {
                  text: 'Collection Browser',
                  icon: require('./icon.png'),
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
