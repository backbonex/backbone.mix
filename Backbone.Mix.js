/**
 * @fileOverview mixin for Backbone
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
(function (Backbone) {
    /**
     * @class Backbone.Mixin
     * @constructor
     * @param {Object} [options]
     * @param {Array.<Object|Backbone.Mixin>} [options.dependencies]
     * @param {Object} proto
     */
    var Mixin = Backbone.Mixin = function (options, proto) {
        if (!proto) {
            proto = options;
            options = {};
        }

        this.proto = proto;
        this.dependencies = options.dependencies || [];
    };

    var checkForSuper = /\b_super\b/;

    /**
     * @returns {Function}
     */
    var mix = function (/**{Object|Backbone.Mixin} mixin1, ..*/) {
        var Class = this;

        _(arguments).forEach(function (mixin) {
            if (mixin instanceof Mixin) {
                Class = mix.apply(Class, mixin.dependencies);
                mixin = mixin.proto;
            }

            if (mixin.initialize && !checkForSuper.test(mixin.initialize.toString())) {
                var init = mixin.initialize;
                mixin.initialize = function () {
                    this._super();
                    return init.apply(this, arguments);
                };
            }

            Class = Class.extend(mixin);
        });

        return Class;
    };

    Backbone.Model.mix = Backbone.Collection.mix = Backbone.Router.mix = Backbone.View.mix = Backbone.History.mix = mix;
})(Backbone);