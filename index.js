import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';
import { YellowBox } from 'react-native';
import Database from './database';

import SampleTune from './sample-tune'; // just a default tune so the component will load. TODO: do something else

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

registerScreens();
Database.init();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              id: 'testId',
              children: [
                {
                  component: {
                    name: 'CurrentTune',
                    passProps: {
                      tune: SampleTune
                    },
                    options: {
                      bottomTab: {
                        text: 'Current Tune',
                        icon: require('./icon.png'),
                      }
                    }
                  },
                },
              ]
            }
          },
          {
            component: {
              name: 'TunesList',
              options: {
                bottomTab: {
                  text: 'Tunes List',
                  icon: require('./icon.png'),
                }
              }
            },
          }
        ]
      }
    }
  });
});
