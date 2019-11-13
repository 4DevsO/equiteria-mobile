import Realm from 'realm';

import OilSpotSchema from '~/schemas/OilSpotSchema';
import PointSchema from '~/schemas/PointSchema';
import PhotoSchema from '~/schemas/PhotoSchema';
import SyncSchedule from '~/schemas/SyncSchedule';

export default function getRealm() {
  return Realm.open({
    path: 'equiteriarealm',
    schema: [OilSpotSchema, PointSchema, PhotoSchema, SyncSchedule],
    schemaVersion: 4,
  });
}
