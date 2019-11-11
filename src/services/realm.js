import Realm from 'realm';

import OilSpotSchema from '~/schemas/OilSpotSchema';
import PointSchema from '~/schemas/PointSchema';

export default function getRealm() {
  return Realm.open({
    path: 'equiteriarealm',
    schema: [OilSpotSchema, PointSchema],
  });
}
