import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Welcome from '~/pages/Welcome';
import Main from '~/pages/Main';
import NewRegister from '~/pages/NewRegister';

const MainRoutes = createStackNavigator(
  {Main, NewRegister},
  {
    headerLayoutPreset: 'left',
    headerBackTitleVisible: false,
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#FFF',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
        marginTop: 20,
      },
      headerTintColor: '#000',
    },
  },
);

const Routes = createAppContainer(createSwitchNavigator({Welcome, MainRoutes}));

export default Routes;
