'use strict';

var _ = require('lodash');

module.exports = {};

module.exports.toCamelCase = _.memoize(function toCamelCase(name) {
  return _.camelCase(name);
});

module.exports.toTitleCase = _.memoize(function toTitleCase(name) {
  return _.capitalize(module.exports.toCamelCase(name));
});

module.exports.getNameFromRef = _.memoize(function getNameFromRef($ref) {
  return module.exports.toTitleCase($ref.split('/').pop());
});

module.exports.isDateType = function(prop) {
  if (prop.type === 'date' ||
      (
        (prop.type === 'string' &&
          (prop['x-chance-type'] && prop['x-chance-type'] === 'date')
        ) ||
        (prop['format'] === 'date' || prop['format'] === 'dateTime'))) {
    return true;
  }

  return false;
}
