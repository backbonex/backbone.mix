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
define(['Backbone', 'underscore', 'vendors/Backbone/Backbone.Mixin'], function (Backbone, _, Mixin) {
    "use strict";

    var checkForSuper = /\b_super\b/;

    /**
     * @returns {Function}
     * @throws {Error} if mixin is not an instance of object
     */
    var mix = function (/**{Object|Backbone.Mixin} mixin1, ..*/) {
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
    };

    Backbone.Model.mix = Backbone.Collection.mix = Backbone.Router.mix = Backbone.View.mix = Backbone.History.mix = mix;
});
