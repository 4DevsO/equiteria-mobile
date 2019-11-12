import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

import getRealm from '~/services/realm';
import api from '~/services/api';

export default (data2sync = [], syncStage, syncStageToogle) => {
  const randomTimeOut =
    Math.floor(Math.random() * 10) * Math.floor(Math.random() * 100);
  console.log(randomTimeOut, syncStage);
  setTimeout(async () => {
    const {isConnected} = await NetInfo.fetch();
    if (isConnected && syncStage === 0) {
      syncStageToogle(syncStage + 1);
      const realm = await getRealm();
      const spots2sync = realm
        .objects('OilSpot')
        .filter(spot => data2sync.findIndex(({id}) => id === spot.id) >= 0);

      const userId = await AsyncStorage.getItem('@equiteria/userId');
      await Promise.all(
        spots2sync.map(async ({id, location, collect_date, tags, photos}) => {
          try {
            console.log(`<syncing> ${id}`);
            const response = await api.post('/oilSpot', {
              spot_id: id,
              user_id: userId,
              location,
              collect_date,
              tags: Array.from(tags),
            });

            if (response.data.success) {
              realm.write(() => {
                const localSpot = realm.objectForPrimaryKey('OilSpot', id);
                localSpot.synced = true;
                console.log(`<synced> ${id}`);
                syncStageToogle(0);
              });
            }
          } catch (err) {
            console.info(
              `<error> <${id}> ${JSON.stringify(err.response.data)}`,
            );
          }
        }),
      );
    }
  }, randomTimeOut);
};
