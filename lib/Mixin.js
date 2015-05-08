/**
 * Helper class for creating mixins that provides possibility to specify dependency for them.
 * @module Mixin
 * @version 1.0.1
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Backbone.Mixin = factory();
    }
}(this, function () {
    'use strict';

    /**
     * @class Mixin
     * @constructor
     * @param {object} options
     * @param {Array.<object|Mixin>} [options.dependencies]
     * @param {object} proto
     * @param {object} [staticProps]
     */
    var Mixin = function (options, proto, staticProps) {
        options = options || {};

        if (!proto) {
            proto = options;
            options = {};
        }

        /**
         * @public
         * @type {object} mixing prototype
         */
        this.proto = proto;

        /**
         * @public
         * @type {Array.<object|Mixin>}
         */
        this.dependencies = options.dependencies || [];

        for (var key in staticProps) {
            if (staticProps.hasOwnProperty(key)) {
                this[key] = staticProps[key];
            }
        }
    };

    return Mixin;
}));
