'use strict';

module.exports = function(grunt, $ref, $refs) {
  var _ = require('lodash');
  var path = require('path');

  var modelTemplate = grunt.file.read(path.join(__dirname, './templates/Model.tpl'));

  function getNameFromRef($ref) {
    return toTitleCase($ref.split('/').pop());
  }

  function needsPropInitializer(prop) {
    if (['integer', 'long', 'float', 'double', 'byte', 'boolean', 'number', 'string'].indexOf(prop.type) === -1) {
      return true;
    }
    return false;
  }

  function propInitializer(name, prop) {
    return 'this.' + toCamelCase(name) + ' = new ' + toTitleCase(name) + '(this.' + toCamelCase(name) + ');';
  }

  function toCamelCase(name) {
    return _.camelCase(name);
  }

  function toTitleCase(name) {
    return _.capitalize(name);
  }

  function generatePropDefaultValue(prop) {
    if (needsPropInitializer(prop)) {
      return 'null';
    } else {
      switch (prop.type) {
        case 'integer':
        case 'long':
        case 'number':
        case 'byte':
          return '0';

        case 'float':
        case 'double':
        case 'decimal':
          return '0.0';

        case 'string':
          return "\'\'";

        case 'boolean':
          return 'false';

        default:
          return 'null';
      }

    }
  }

  var templateData = {
    generatePropDefaultValue: generatePropDefaultValue,
    needsPropInitializer: needsPropInitializer,
    propInitializer: propInitializer,
    toCamelCase: toCamelCase,
    toTitleCase: toTitleCase,
    Schema: null
  };

  var schema = $refs[$ref];
  schema.name = getNameFromRef($ref);

  templateData.Schema = schema;

  return grunt.template.process(modelTemplate, {data: templateData});
}
