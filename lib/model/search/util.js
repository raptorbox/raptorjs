var u = module.exports;

u.getFieldName = function (opts) {

  var hasField = (typeof opts.field !== 'undefined' && opts.field),
    hasChannel = (typeof opts.channel !== 'undefined' && opts.channel /*&& me.getChannel(opts.channel)*/ );

  if(!hasChannel && !hasField) {
    throw new Error("At least a valid `channel` or `field` properties has to be provided for numeric search");
  }

  if(hasField) {
    return opts.field;
  } else if(hasChannel) {
    return "channels." + opts.channel + ".current-value";
  }
};

u.hasProp = function (data, name) {
  return data && undefined !== data[name];
};
