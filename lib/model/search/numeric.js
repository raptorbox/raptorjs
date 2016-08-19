var util = require('./util');

/**

  {
      "numericrange": true,
      "rangefrom": 13,
      "rangeto": 17,
      "numericrangefield": "channels.age.current-value",
  }

  {
      numeric: {
          channel: 'name'
          from: 1
          to: 10
      }
  }

*/

module.exports = function (params, query) {
  if(!params) return;
  query.numericrange = true;
  query.numericrangefield = util.getFieldName(params);
  var hasFrom = util.hasProp(params, "from"),
    hasTo = util.hasProp(params, "to");
  if(!hasFrom && !hasTo) {
    throw new Error("At least one of `from` or `to` properties has to be provided for numeric range search");
  }
  if(hasFrom) {
    query.rangefrom = params.from;
  }
  if(hasTo) {
    query.rangeto = params.to;
  }
};
