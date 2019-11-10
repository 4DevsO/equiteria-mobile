import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

import '~/config/ReactotronConfig';

import Routes from '~/routes';

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#D8CBB7"
        translucent
      />
      <Routes />
    </>
  );
};

export default App;
