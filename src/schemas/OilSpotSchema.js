export default class OilSpotSchema {
  static schema = {
    name: 'OilSpot',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true},
      user_id: {type: 'string?'},
      collect_date: {type: 'date?'},
      location: {type: 'Point'},
      location_name: {type: 'string?'},
      tags: {type: 'string[]'},
      description: {type: 'string?'},
      other_description: {type: 'string?'},
      photos: {type: 'list', objectType: 'Photo'},
      synced: {type: 'bool?', default: false},
      active: {type: 'bool?', default: true},
    },
  };
}
