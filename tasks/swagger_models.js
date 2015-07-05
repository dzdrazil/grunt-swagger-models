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

    var swaggerParser = require('swagger-parser');

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
console.log(doc.paths);
process.exit();
      var models = [];
      var collections = [];

      for ($ref in $refs) {
        models.push(generateModel(grunt, $ref, $refs));
        collections.push(generateCollection(grunt, $ref, $refs));
      }
    });
  });
};
