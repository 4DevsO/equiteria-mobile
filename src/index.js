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
import api, {reverseGeoLocation} from '~/services/api';
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

          if (toSync.length) {
            toSync.map(spot2sync => {
              console.log(`<syncing> ${spot2sync.spot_id}`);

              const spot = realm.objectForPrimaryKey(
                'OilSpot',
                spot2sync.spot_id,
              );

              if (spot) {
                const data = {
                  ...spot,
                  tags: Array.from(spot.tags),
                  spot_id: spot.id,
                  id: undefined,
                  photos: undefined,
                };
                api
                  .post('/oilSpot', data)
                  .then(response => {
                    if (response.data.success) {
                      realm.write(async () => {
                        const localSpot = realm.objectForPrimaryKey(
                          'OilSpot',
                          spot.id,
                        );

                        const reverseLocationName = await reverseGeoLocation(
                          localSpot.location,
                        ).catch(geoErr => console.log('<error>', geoErr));
                        console.log(
                          '<locationName>',
                          localSpot.location_name,
                          '\n<reverseGeoName>',
                          reverseLocationName,
                        );
                        realm.write(() => {
                          localSpot.location_name = reverseLocationName;
                          localSpot.synced = true;
                        });
                        console.log(`<synced> ${spot.id}`);
                        await imageUploadHandler({
                          spotId: spot.id,
                          images: spot.photos,
                        });
                        const syncedSpot = realm.objectForPrimaryKey(
                          'SyncSchedule',
                          spot.id,
                        );
                        realm.write(() => {
                          realm.delete(syncedSpot);
                        });
                      });
                    }
                  })
                  .catch(err => {
                    if (err.response) {
                      console.log('<failed to sync>', err.response.data);
                    } else {
                      console.log('<error>', err);
                    }
                  });
              } else {
                realm.write(() => {
                  const a2delete = realm.objectForPrimaryKey(
                    'SyncSchedule',
                    spot2sync.spot_id,
                  );
                  realm.delete(a2delete);
                });
              }
            });
          } else {
            const toSyncImg = realm.objects('SyncScheduleImages');
            if (toSyncImg.length) {
              toSyncImg.map(async image2sync => {
                console.log(`<syncing images> ${image2sync.spot_id}`);

                const spot = realm.objectForPrimaryKey(
                  'OilSpot',
                  image2sync.spot_id,
                );

                if (spot) {
                  await imageUploadHandler({
                    spotId: spot.id,
                    images: spot.photos,
                  });
                  const syncedSpot = realm.objectForPrimaryKey(
                    'SyncScheduleImage',
                    spot.id,
                  );
                  realm.write(() => {
                    realm.delete(syncedSpot);
                  });
                } else {
                  realm.write(() => {
                    const a2delete = realm.objectForPrimaryKey(
                      'SyncSchedule',
                      image2sync.spot_id,
                    );
                    realm.delete(a2delete);
                  });
                }
              });
            }
          }
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
