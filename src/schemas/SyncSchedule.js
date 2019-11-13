export default class SyncScheduleSchema {
  static schema = {
    name: 'SyncSchedule',
    primaryKey: 'spot_id',
    properties: {
      spot_id: {type: 'string', indexed: true},
      created_at: {type: 'date'},
    },
  };
}
