/**
 * @fileOverview логировнаие
 * @example Usage
 * <code class="javascript">
 * // Напишем кота который умеет что-нибудь логировать
 * var Cat = Backbone.Model.extend({
 *     initialize: function(){
 *         this.log('Cat created', 'info');
 *     },
 *
 *     meow: function(){
 *         this.log('oh long johnson');
 *     }
 * });
 *
 * var cat = new Cat;   // ничего никуда
 * cat.meow();          // не напишет
 *
 * // Но стоит нам добавить миксин для дебага и мы сможем видить эти сообщения:
 * var Cat = Backbone.Model.mix(Backbone.WithLogger).extend({
 *     //...
 * });
 *
 * var talkingCat = new Cat;   // (i) 'Cat created'
 * talkingCat.meow();          // 'oh long johnson'
 * </code>
 */
(function (Backbone) {
    var allowedTypes = /log|warn|error|info/;

    /**
     * Миксин для логирования
     * @class Backbone.WithLogger
     */
    Backbone.WithLogger = {
        initialize: function () {
            this._super();

            console.warn('Logger enabled');
        },

        /**
         * Логирует сообщение. Последний параметр может быть типом сообщения: log, warn, error, info
         */
        log: function (/**message1, .., type*/) {
            var args = Array.prototype.slice.call(arguments);
            var type = allowedTypes.test(args[args.length - 1]) ? args.pop() : 'log';
            console[type].apply(console, args);
        }
    };

    /**
     * @param {...string} message
     * @param {string} [type]
     */
    Backbone.Model.prototype.log =
        Backbone.Collection.prototype.log =
        Backbone.Router.prototype.log =
        Backbone.View.prototype.log = function(message, type){};
})(Backbone);