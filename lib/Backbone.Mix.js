/**
 * Implementation of mixins for Backbone. Adds the static method `mix` for all Backbone classes.
 * @module Backbone.Mix
 * @requires Backbone
 * @requires Mixin
 * @version 1.0.0
 * @example Usage
 * ```js
 * var Editable = {
 *     edit: function(){
 *         console.log('edit');
 *     }
 * };
 *
 * var Article = Backbone.Model.mix(Editable).extend({
 *     initialize: function(){
 *         Backbone.Model.prototype.initialize.call(this);
 *         this.edit(); // logs "edit"
 *     }
 * });
 * ```
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', './Mixin'], factory);
    } else {
        factory(root.Backbone, root.Backbone.Mixin);
    }
}(this, function (Backbone, Mixin) {
    'use strict';

    /**
     * @returns {Function}
     * @param {...Mixin|object} mixin
     * @throws {Error} if mixin is not an instance of object
     */
    Backbone.Model.mix = Backbone.Collection.mix = Backbone.Router.mix =
    Backbone.View.mix = Backbone.History.mix = function mix(mixin) {
        var Class = this;

        Array.prototype.forEach.call(arguments, function (mixin) {
            // resolve dependencies
            if (mixin instanceof Mixin) {
                Class = mix.apply(Class, mixin.dependencies);
                mixin = mixin.proto;
            }

            if (typeof mixin !== 'object' || mixin === null) {
                throw new Error('Mixin must be an object');
            }

            // do not mix the same mixin twice
            if (Class.mixed && Class.mixed.indexOf(mixin) != -1) {
                return;
            }

            // place temporary class based on mixin to the prototype chain
            Class = Class.extend(mixin, {
                mixed: Class.mixed ? Class.mixed.slice(0) : []
            });

            Class.mixed.push(mixin);
        });

        return Class;
    };

    return Backbone;
}));
