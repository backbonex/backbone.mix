define(['underscore'], function (_) {
    /**
     * @class Mixin
     * @constructor
     * @param {object} [options]
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

        _.extend(this, staticProps);
    };

    return Mixin;
});
