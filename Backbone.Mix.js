/**
 * @fileOverview mix static method for Backbone classes
 * @example Usage
 * <code class="javascript">
 * var Editable = {
 *     edit: function(){
 *         console.log('edit');
 *     }
 * };
 *
 * var Article = Backbone.Model.mix(Editable).extend({
 *     initialize: function(){
 *         this._super();
 *         this.edit();
 *     }
 * });
 * </code>
 */
define([
    'Backbone',
    'underscore',
    './Mixin'
], function (Backbone, _, Mixin) {
    "use strict";

    /**
     * @returns {Function}
     * @param {...Mixin|object} mixin
     * @throws {Error} if mixin is not an instance of object
     */
    Backbone.Model.mix = Backbone.Collection.mix = Backbone.Router.mix = Backbone.View.mix = Backbone.History.mix = function mix (mixin) {
        var Class = this;

        Array.prototype.forEach.call(arguments, function (mixin) {
            if (mixin instanceof Mixin) {
                Class = mix.apply(Class, mixin.dependencies);
                mixin = mixin.proto;
            }

            if (!_.isObject(mixin)) {
                throw new Error('Mixin must be an object');
            }

            if (Class.mixed && Class.mixed.indexOf(mixin) != -1) {
                return;
            }

            Class = Class.extend(mixin, {
                mixed: Class.mixed ? Class.mixed.slice(0) : []
            });

            Class.mixed.push(mixin);

        });

        return Class;
    };

    /**
     * Filters mixins from the passed arguments and mixes it into current class
     * @param {Arguments} args
     * @returns {Function}
     */
    Backbone.Model.mixArguments = Backbone.Collection.mixArguments = Backbone.Router.mixArguments =
        Backbone.View.mixArguments = Backbone.History.mixArguments = function (args) {
            var mixins = Array.prototype.filter.call(args, function (arg) {
                return arg instanceof Mixin;
            });

            return this.mix.apply(this, mixins);
        };
});
