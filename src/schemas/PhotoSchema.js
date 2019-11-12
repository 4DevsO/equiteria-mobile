export default class PhotoSchema {
  static schema = {
    name: 'Photo',
    properties: {
      data: {type: 'string'},
      synced: {type: 'bool?', defalut: false},
    },
  };
}
