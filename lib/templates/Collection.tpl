define(function(require) {
    'use strict';

    var BaseCollection = require('data-core').BaseCollection;

    var <%= Schema.name%>Model = require('./<%= Schema.name%>Model');

    function <%= Schema.name %>Collection(data) {
        BaseCollection.call(this, data);
    }

    <%= Schema.name%>Collection.prototype = Object.create(BaseCollection.prototype);
    <%= Schema.name%>Collection.prototype.constructor = <%= Schema.name%>Collection;

    <%= Schema.name%>Collection.prototype.modelConstructor = <%= Schema.name%>Model;

    return <%= Schema.name%>Collection;
});
