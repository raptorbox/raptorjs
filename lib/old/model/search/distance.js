var util = require('./util');

/*
 {
    "geodistance": true,
    "geodistancevalue": 300,
    "pointlat": 43.15,
    "pointlon": 15.43,
    "geodistanceunit": "km"
}

{
    distance: {
        position: {latitude: '', longitude: ''}
        // or
        // position: [lat, lon]
        value: 'val',
        unit: 'km'
    }
}


*/

module.exports = function (params, query) {

  if(!params) return;

  if(query.bbox) {
    throw new Error("Bounding box and distance search cannot be used together");
  }

  query.geodistance = true;

  if(params.position) {
    var position = params.position;
    var isArray = (position instanceof Array);
    params.lat = isArray ? position[0] : (position.latitude || position.lat);
    params.lon = isArray ? position[1] : (position.longitude || position.lon);
  }

  var hasValue = hasProp(params, "value"),
    hasLat = util.hasProp(params, "lat") || util.hasProp(params, "latitude"),
    hasLng = util.hasProp(params, "lon") || util.hasProp(params, "longitude");

  if(!hasLat || !hasLng || !hasValue) {
    throw new Error("`latitude`, `longitude` and `value` properties must be provided for distance search");
  }

  query.geodistanceunit = params.unit || "km";
  query.geodistancevalue = params.value;
  query.pointlat = params.lat || params.latitude;
  query.pointlon = params.lon || params.longitude;

};
