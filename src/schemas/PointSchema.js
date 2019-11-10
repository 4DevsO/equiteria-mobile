export default class PointSchema {
  static schema = {
    name: 'Point',
    properties: {
      latitude: {type: 'double'},
      longitude: {type: 'double'},
    },
  };
}
