import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

import getRealm from '~/services/realm';
import api from '~/services/api';

export default async (data2sync = []) => {
  const {isConnected} = await NetInfo.fetch();
  if (isConnected) {
    const realm = await getRealm();
    const spots2sync = realm
      .objects('OilSpot')
      .filter(spot => data2sync.findIndex(({id}) => id === spot.id) >= 0);

    const userId = await AsyncStorage.getItem('@equiteria/userId');
    spots2sync.map(({id, location, collect_date, tags, photos}) => {
      console.log(`<syncing> ${id}`);
      api
        .post('/oilSpot', {
          spot_id: id,
          user_id: userId,
          location,
          collect_date,
          tags: Array.from(tags),
        })
        .then(response => {
          if (response.data.success) {
            realm.write(() => {
              const localSpot = realm.objectForPrimaryKey('OilSpot', id);
              localSpot.synced = true;
              console.log(`<synced> ${id}`);
            });
          }
        })
        .catch(err =>
          console.info(`<error> <${id}> ${JSON.stringify(err.response.data)}`),
        );
    });
  }
};
