var util = require('./util');
var libUtil = require('../../util');

/**
{
    "timerange": true,
    "timerangefrom": 1396859660,
    "timerangeto": 1396859660,
}

{
    time: {
        from: time
        to: time
    }
}
*/

module.exports = function (params, query) {
  if(!params) return;

  query.timerange = true;

  var hasFrom = util.hasProp(params, "from"),
    hasTo = util.hasProp(params, "to");

  if(!hasFrom && !hasTo) {
    throw new Error("At least one of `from` or `to` properties has to be provided for time range search");
  }

  // set defaults
  // if from is not set, set to epoch
  params.from = params.from || (new Date(0));
  // if to is not set, set to now
  params.to = params.to || (new Date());

  // if(hasFrom) {
  var timeFrom = libUtil.parseDate(params.from);
  query.timerangefrom = libUtil.toUNIX(timeFrom);
  // }

  // if(hasTo) {
  var timeTo = libUtil.parseDate(params.to);
  query.timerangeto = libUtil.toUNIX(timeTo);
  // }

};
