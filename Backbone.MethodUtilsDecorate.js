define([
    'Backbone',
    'vendors/Backbone/Backbone.Redefine',
    'vendors/Backbone/Backbone.MethodUtils',
    'vendors/Backbone/Backbone.Decorate'
], function (Backbone) {
    "use strict";

    var MethodUtilsDecorate = function (origin) {
        /**
         * @lends Backbone.View
         * @lends Backbone.Router
         * @lends Backbone.Collection
         * @lends Backbone.History
         * @lends Backbone.Model
         */
        return {
            /**
             * @public
             * @see {@link Backbone.Model.decorate}
             */
            onDecorate: function () {
                origin.onDecorate.apply(this, arguments);
                this._wrapMethods();
                return this;
            }
        };
    };

    Backbone.View.redefine(MethodUtilsDecorate);
    Backbone.Model.redefine(MethodUtilsDecorate);
    Backbone.Router.redefine(MethodUtilsDecorate);
    Backbone.Collection.redefine(MethodUtilsDecorate);
    Backbone.History.redefine(MethodUtilsDecorate);
});
