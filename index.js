import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';
import { YellowBox } from 'react-native';
import Database from './database';

import SampleTune from './sample-tune'; // just a default tune so the component will load. TODO: do something else

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

registerScreens();
Database.init(); // should I do something to wait until this completes before continuing?

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
