export default class SyncScheduleSchema {
  static schema = {
    name: 'SyncSchedule',
    properties: {
      spot_id: {type: 'string', indexed: true},
      created_at: {type: 'date'},
    },
  };
}
