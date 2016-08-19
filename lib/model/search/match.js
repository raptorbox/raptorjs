var util = require('./util');

/**
{
    "match": true,
    "matchfield": "channels.name.current-value",
    "matchstring": "Peter Jo*",

    options.match : {
        channel: '',
        string: ''
    }

}
*/
module.exports = function (params, query) {
  if(!params) return;

  query.match = true;
  query.matchfield = util.getFieldName(params);

  var hasString = util.hasProp(params, "string");

  if(!hasString) {
    throw new Error("A value for `string` property has to be provided for text based search");
  }

  query.matchstring = params.string;
};
