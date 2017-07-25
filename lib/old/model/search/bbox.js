/**
{
    "geoboundingbox": true,
    "geoboxupperleftlon": 15.43,
    "geoboxupperleftlat": 43.15,
    "geoboxbottomrightlat": 47.15,
    "geoboxbottomrightlon": 15.47

    bbox: {
        coords: [
            { latitude: '', longitude: ''}, // top position
            { latitude: '', longitude: ''}  // bottom position
        ]
    }
}
*/

module.exports = function (params, query) {

  if(!params) return;

  if(query.geodistance) {
    throw new Error("Bounding box and distance search cannot be used together");
  }

  query.geoboundingbox = true;

  var hasBbox = false;
  if(params.coords) {
    // [toplat, toplon, bottomlat, bottomlon]
    if(params.coords instanceof Array && params.coords.length === 4) {
      query.geoboxupperleftlat = params.coords[0];
      query.geoboxupperleftlon = params.coords[1];
      query.geoboxbottomrightlat = params.coords[2];
      query.geoboxbottomrightlon = params.coords[3];
      hasBbox = true;
    }
    //[{lat, lon}, {lat, lon}]
    if(params.coords instanceof Array && params.coords.length === 2) {
      query.geoboxupperleftlat = params.coords[0].lat || params.coords[0].latitude;
      query.geoboxupperleftlon = params.coords[0].lon || params.coords[0].longitude;
      query.geoboxbottomrightlat = params.coords[1].lat || params.coords[1].latitude;
      query.geoboxbottomrightlon = params.coords[1].lon || params.coords[1].longitude;
      hasBbox = true;
    }
  }

  if(!hasBbox) {
    throw new Error("The values provided for `coords` option are not valid");
  }

};
