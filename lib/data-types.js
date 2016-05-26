
module.exports.list = [
  'number', 'string', 'boolean', 'geo_point'
];

module.exports.exists = function(name) {
  return module.exports.list.indexOf(name.toLowerCase()) > -1;
};

module.exports.add = function(name, val) {
  module.exports.list[name] = val;
};

module.exports.remove = function(name) {
  if(module.exports.list[name] !== undefined) {
    delete module.exports.list[name];
  }
};
