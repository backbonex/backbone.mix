define(['underscore'], function (_) {
    /**
     * @class Mixin
     * @constructor
     * @param {Object} [options]
     * @param {Array.<Object|Mixin>} [options.dependencies]
     * @param {Object} proto
     * @param {Object} [staticProps]
     */
    var Mixin = function (options, proto, staticProps) {

        options = options || {};

        if (!proto) {
            proto = options;
            options = {};
        }

        /**
         * @public
         * @type {Object} mixing prototype
         */
        this.proto = proto;

        /**
         * @public
         * @type {Array.<Object|Mixin>}
         */
        this.dependencies = options.dependencies || [];

        _.extend(this, staticProps);
    };

    /**
     * Creates a new class based on instance's constructor and mixes self to it. After that this class decorates the
     * instance.
     * @param {Object} instance
     * @returns {Object}
     */
    Mixin.prototype.decorate = function (instance) {
        var MixedClass = instance.constructor.mix(this);
        return MixedClass.decorate(instance);
    };

    return Mixin;
});
