export default class OilSpotSchema {
  static schema = {
    name: 'OilSpot',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true},
      user_id: {type: 'string?'},
      collect_date: {type: 'date?'},
      location: {type: 'Point'},
      tags: {type: 'string[]'},
      photos: {type: 'string[]'},
      synced: {type: 'bool?', default: false},
      active: {type: 'bool?', default: true},
    },
  };
}
