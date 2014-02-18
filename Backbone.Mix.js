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
 *         this.edit();
 *     }
 * });
 * </code>
 */
define([
    'Backbone',
    'underscore',
    './Mixin',
    'BackboneSuper'
], function (Backbone, _, Mixin) {
    "use strict";

    var checkForSuper = /\b_super\b/;

    /**
     * @returns {Function}
     * @throws {Error} if mixin is not an instance of object
     */
    function mix(/**{Object|Mixin} mixin1, ..*/) {
        var Class = this;

        _(arguments).forEach(function (mixin) {
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

            if (mixin.initialize && !checkForSuper.test(mixin.initialize.toString())) {
                var init = mixin.initialize;
                mixin.initialize = function () {
                    this._super();
                    return init.apply(this, arguments);
                };
            }

            Class = Class.extend(mixin, {
                mixed: Class.mixed ? _.clone(Class.mixed) : []
            });

            Class.mixed.push(mixin);

        });

        return Class;
    }

    /**
     * Filters mixins from the passed arguments and mixes it into current class
     * @param {Arguments} args
     * @returns {Function}
     */
    function mixArguments(args) {
        var mixins = Array.prototype.filter.call(args, function (arg) {
            return arg instanceof Mixin;
        });

        return mix.apply(this, mixins);
    }

    Backbone.Model.mix = Backbone.Collection.mix = Backbone.Router.mix = Backbone.View.mix = Backbone.History.mix = mix;
    Backbone.Model.mixArguments = Backbone.Collection.mixArguments = Backbone.Router.mixArguments =
        Backbone.View.mixArguments = Backbone.History.mixArguments = mixArguments;
});
