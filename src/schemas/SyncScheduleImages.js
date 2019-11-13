export default class SyncScheduleImagesSchema {
  static schema = {
    name: 'SyncScheduleImages',
    primaryKey: 'spot_id',
    properties: {
      spot_id: {type: 'string', indexed: true},
      created_at: {type: 'date'},
    },
  };
}
