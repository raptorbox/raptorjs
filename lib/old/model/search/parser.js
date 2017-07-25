
var parsers = {
  numeric: require('./numeric'),
  time: require('./time'),
  match: require('./match'),
  bbox: require('./bbox'),
  distance: require('./distance'),
};

module.exports.parse = function(params, stream) {
  var query = {};
  Object.keys(parsers).forEach(function(parserKey) {
    if(params[parserKey]) {
      parsers[parserKey](params[parserKey], query, { allParams: params, stream: stream });
    }
  });
  return query;
};
