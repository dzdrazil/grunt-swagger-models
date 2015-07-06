'use strict';

module.exports = function(grunt, $ref, $refs, options) {
  var _ = require('lodash');
  var path = require('path');
  var utils = require('./utils');
  var toCamelCase = utils.toCamelCase;
  var toTitleCase = utils.toTitleCase;
  var getNameFromRef = utils.getNameFromRef;
  var isDateType = utils.isDateType;

  var modelTemplate = grunt.file.read(path.join(__dirname, './templates/Model.tpl'));

  function refIsCollection($ref, $refs) {
    var schema = $refs[$ref];
    if (!schema.properties &&
      (schema.type && schema.type === 'array') &&
      (schema.items.$ref)) {
      return true;
    }
    return false;
  }

  function needsPropInitializer(prop) {
    if ((prop.type === 'array' && prop.type.$ref)
      || prop.$ref) {
      return true;
    }

    if (isDateType(prop)) {
      return true;
    }

    if (['integer', 'long', 'float', 'double', 'byte', 'boolean', 'number', 'string', '$ref'].indexOf(prop.type) === -1) {
      return true;
    }
    return false;
  }

  function propInitializer(name, prop) {
    var preamble = 'this.' + toCamelCase(name) + ' = new ';
    var constructorParams = '(this.' + toCamelCase(name) + ');'

    // if it's an array of a defined schema, it's a collection
    if (prop.type === 'array' && prop.type.$ref) {
      return preamble + toTitleCase(getNameFromRef(prop.items.$ref)) + 'Collection' + constructorParams;

    // if it's a string that's supposed to be a date, it's a Date object
    // } else if (prop.type === 'date' ||
    //   (
    //     (prop.type === 'string' &&
    //       (prop['x-chance-type'] && prop['x-chance-type'] === 'date')
    //     ) ||
    //     (prop['format'] === 'date' || prop['format'] === 'dateTime'))) {
    } else if (isDateType(prop)) {
      return preamble + 'Date' + constructorParams;

    // if it's a $ref, use the $ref name
    } else if (prop.$ref) {
      var type = 'Model';
      if (refIsCollection(prop.$ref, $refs)) {
        type = 'Collection';
      }
      var refName = toTitleCase(getNameFromRef(prop.$ref)) + type;
      return preamble + refName + constructorParams;
    }

    // it's a model of some sort
    return preamble + toTitleCase(name) + constructorParams;
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

  function getRequiredModules(properties) {
    var modules = [];
    _.forEach(properties, function(property, name) {
      if (property.$ref) {
        modules.push(property.$ref);
      } else if (property.items && property.items.$ref) {
        modules.push(property.items.$ref);
      }
    });

    return _.uniq(modules)
      .map(function($ref) {
        var type = 'Model';
        if (refIsCollection($ref, $refs)) {
          type = 'Collection';
        }

        var baseName = getNameFromRef($ref);
        var fullName = baseName + type;
        return {
          name: toTitleCase(fullName),
          path: options.requireBase + toCamelCase(baseName) + '/' + toTitleCase(fullName)
        };
      });
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

  schema.requiredModules = getRequiredModules(schema.properties);

  templateData.Schema = schema;

  return grunt.template.process(modelTemplate, {data: templateData});
}
