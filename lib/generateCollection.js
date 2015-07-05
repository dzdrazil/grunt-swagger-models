'use strict';

module.exports = function(grunt, $ref, $refs) {
  var _ = require('lodash');
  var path = require('path');

  var collectionTemplate = grunt.file.read(path.join(__dirname, './templates/Collection.tpl'));

  function getNameFromRef($ref) {
    return toTitleCase($ref.split('/').pop());
  }

  function toTitleCase(name) {
    return _.capitalize(name);
  }

  var templateData = {
    Schema: null
  };

  var schema = $refs[$ref];
  schema.name = getNameFromRef($ref);

  templateData = {
    Schema: schema
  };

  return grunt.template.process(collectionTemplate, {data: templateData});
};
