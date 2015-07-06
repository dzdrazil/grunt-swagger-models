/*
 * grunt-swagger-models
 * https://github.com/dzdra_000/grunt-swagger-models
 *
 * Copyright (c) 2015 dzdrazil
 * Licensed under the MIT license.
 */

'use strict';



module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('swagger_models', 'A generator task to create an API Resource, Collection and Model class for entities from a swagger file', function() {
    var generateModel = require('../lib/generateModel');
    var generateCollection = require('../lib/generateCollection');
    var utils = require('../lib/utils');
    var getNameFromRef = utils.getNameFromRef;
    var toCamelCase = utils.toCamelCase;

    var swaggerParser = require('swagger-parser');
    var path = require('path');

    var options = this.options();

    if (!grunt.file.exists(options.swaggerFile)) {
      grunt.fail.warn('Swagger Models: Swagger file ' + options.swaggerFile + ' not found', 3);
      return false;
    }

    if (grunt.file.exists(options.dest) && !grunt.file.isDir(options.dest)) {
      grunt.fail.warn('Swagger Models: `dest` property is not a directory');
    }

    var done = this.async();

    var swaggerOptions = {
      'dereference$Refs': false
    };

    swaggerParser.parse(options.swaggerFile, swaggerOptions, function(error, doc, metadata) {
      if (error) {
        grunt.log.error(error);
        return done(false);
      }

      var $refs = metadata['$refs'];
      var $ref;

      // var models = [];
      // var collections = [];
      var entityModules = [];

      for ($ref in $refs) {
        entityModules.push({
          lowerName: toCamelCase(getNameFromRef($ref)),
          titleName: getNameFromRef($ref),
          model: generateModel(grunt, $ref, $refs, options),
          collection: generateCollection(grunt, $ref, $refs)
        });
      }

      entityModules.forEach(function(entity) {
        var basePath = path.join(options.dest, options.requireBase, entity.lowerName);

        grunt.file.write(path.join(basePath, entity.titleName + 'Model.js'), entity.model);
        grunt.file.write(path.join(basePath, entity.titleName + 'Collection.js'), entity.collection);
      });
    });
  });
};
