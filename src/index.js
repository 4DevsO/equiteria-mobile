import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {GoogleSignin} from 'react-native-google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

const {webClientId} = require('~/services/secrets.json');

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

import '~/config/ReactotronConfig';

import Routes from '~/routes';

import getRealm from '~/services/realm';
import api from '~/services/api';
import {imageUploadHandler} from '~/pages/NewRegister';

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
    const googleBootstrap = async () => {
      await GoogleSignin.configure({
        scopes: [],
        webClientId,
      });
    };

    const try2sync = async () => {
      const userId = await AsyncStorage.getItem('@equiteria/userId');
      if (userId !== null) {
        const {isConnected} = await NetInfo.fetch();
        if (isConnected) {
          const realm = await getRealm();
          const toSync = realm.objects('SyncSchedule');

          toSync.map(spot => {
            console.log(`<syncing> ${spot.id}`);

            const data = {
              ...spot,
              spot_id: spot.id,
              id: undefined,
              photos: undefined,
            };
            api.post('/oilSpot', data).then(response => {
              if (response.data.success) {
                realm.write(() => {
                  const localSpot = realm.objectForPrimaryKey(
                    'OilSpot',
                    spot.id,
                  );
                  localSpot.synced = true;
                  console.log(`<synced> ${spot.id}`);
                  imageUploadHandler({
                    spotId: spot.id,
                    image: spot.photos,
                  });
                });
              }
            });
          });
        } else {
          Toast.show(
            'Você está sem internet no momento.' +
              '\nNa proxíma vez que você utilizar o e-Quitéria seus registros serão sincronizados.',
            Toast.LONG,
          );
        }
      }
    };

    googleBootstrap();
    try2sync();
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
