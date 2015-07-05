define(function(require) {
    'use strict';

    var BaseModel = require('data-core').BaseModel;

    function <%= Schema.name %>Model(data) {
        BaseModel.call(this, data);

        <% for (var prop in Schema.properties) { %><%
            if (needsPropInitializer(Schema.properties[prop])) { print(propInitializer(prop, Schema.properties[prop])); }
        %><% } %>
    }

    <%= Schema.name %>Model.prototype = Object.create(BaseModel.prototype);
    <%= Schema.name %>Model.prototype.constructor = <%= Schema.name %>;

    <% for (var prop in Schema.properties) { %>
    <%= Schema.name %>Model.prototype.<%= toCamelCase(prop) %> = <%= generatePropDefaultValue(Schema.properties[prop]) %>;
    <% } %>

    return <%= Schema.name %>Model;
});
