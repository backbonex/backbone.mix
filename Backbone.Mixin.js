(function (Backbone) {
    /**
     * Подмешивает mixProto в прототип класса.
     * @param {Function|Boolean} [condition=true] Условие, при выполнении которого произойдет подмешивание. Если
     * передана функция, будет проверен ее результат.
     * @param {Object|Function} mixProto Объект свойства которого будут подмешаны в прототип функции, если передана
     * функция, будет подмешан ее результат, единственным аргументом в эту функцию будет передан оригинальный прототип
     * @return {Function} this
     * @example Простое использование
     * <code class="javascript">
     * var Origin = Backbone.View.extend({
     *     initialize: function(){
     *         console.log('origin init');
     *     },
     *
     *     method: function(){
     *         console.log('origin method');
     *     }
     * });
     *
     * var Mixed = Origin.mixin({
     *     method: function(){
     *         console.log('mixed method');
     *     }
     * });
     *
     * Mixed === Origin; // true, Mixed - алиас для документации
     *
     * var instance = new Origin; // залогируется 'origin init'
     * instance.method();         // залогируется 'mixed method'
     * </code>
     *
     * @example Использование оригинальных методов внутри переопердеелнных
     * <code class="javascript">
     * var Origin = Backbone.View.extend({
     *     method: function(){
     *         console.log('origin method');
     *     }
     * });
     *
     * Origin.mixin(function(origin){return {
     *     method: function(){
     *         origin.method.call(this);
     *         console.log('mixed method');
     *     }
     * }});
     *
     * var instance = new Origin;
     * instance.method();         // залогируется 'origin method' и 'mixed method'
     * </code>
     *
     * @example Простое использование
     * <code class="javascript">
     * var Origin = Backbone.View.extend({
     *     method: function(){
     *         console.log('origin method');
     *     }
     * });
     *
     * var isAdmixtureNeeded = function(){
     *     return true;
     * }
     *
     * Origin.mixin(isAdmixtureNeeded, {
     *     method: function(){
     *         console.log('mixed method');
     *     }
     * });
     * </code>
     */
    var mixin = function(condition, mixProto){
        if (!mixProto) {
            mixProto = condition;
            condition = true;
        }

        if (typeof condition == 'function') {
            condition = condition();
        }

        if (!condition) {
            return this;
        }

        if (typeof mixProto == 'function') {
            mixProto = mixProto(this.prototype);
            this.prototype = _.defaults(mixProto, this.prototype);
        }
        else {
            _.extend(this.prototype, mixProto);
        }

        return this;
    };

    Backbone.Model.mixin = Backbone.Collection.mixin = Backbone.Router.mixin = Backbone.View.mixin = mixin;
})(Backbone);