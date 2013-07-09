/**
 * @class Backbone.PropertiesView
 * @extends Backbone.View
 */
Backbone.PropertiesView = Backbone.View.redefine(function (origin) {
    return /**@lends Backbone.View*/{

        initialize: function () {
            this._initProperties();
            return origin.initialize.apply(this, arguments);
        },

        /**
         * method for view properties initialisation
         * @protected
         */
        _initProperties: function () {
        }
    }
});