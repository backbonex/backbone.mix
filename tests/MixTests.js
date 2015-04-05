define([
    'backbone',
    'expect',
    'mochaOOPWrapper',
    'lib/Mixin',
    'lib/Backbone.Mix'
], function (Backbone, expect, mochaOOPWrapper, Mixin) {
    'use strict';

    /**
     * Intermediate class based on mochaOOPWrapper
     * @class MochaOOPWrapper
     * @extends Backbone.View
     */
    var MochaOOPWrapper = Backbone.View.extend(mochaOOPWrapper);

    /**
     * @class MixTests
     * @extends MochaOOPWrapper
     */
    return MochaOOPWrapper.extend(/**@lends MixTests#*/{
        /**
         * Name of testing module
         * @type {string}
         * @protected
         */
        _name: 'Backbone Mix',

        /**
         * @constructs
         */
        initialize: function () {
            Backbone.View.prototype.initialize.apply(this, arguments);

            // run tests after initialization
            this._initTests();
        },

        /**
         * Define here all the tests you want to run. Each test suite should be
         * in separate method. All methods mentioned here will be bound to the
         * test class context. Set a name for the suite as a name of entity you
         * are going to test there
         * @protected
         */
        _describe: function () {
            this.describe('Mixing with bad arguments', this._checkAllowedMixingArguments);
            this.describe('Common mixing', this._checkCommonMixing);
            this.describe('Mixing with dependencies', this._checkMixingWithDependencies);
            this.describe('Static properties for mixins', this._checkStaticProperties);
        },

        /**
         * @private
         */
        _checkAllowedMixingArguments: function () {
            [false, undefined, null].forEach(function (notAnObject) {
                this.it('should throw errors if ' + String(notAnObject) + ' passed', function (notAnObject) {
                    expect(function () {
                        Backbone.Model.mix(notAnObject);
                    }).to.throwError(/Mixin must be an object/);
                }.bind(this, notAnObject));
            }, this);
        },

        /**
         * @private
         */
        _checkCommonMixing: function () {
            var MixinContent = {
                mixedProp: 'mixed prop',
                mixedProp2: 'mixed prop 2'
            };

            var ClassProto = {
                prop: 'class prop',
                mixedProp2: 'redefined prop 2'
            };

            this.describe('mixin as object', function () {
                var ClassWithSimpleMixin = Backbone.Model.mix(MixinContent).extend(ClassProto);
                this._checkInstancePropertiesAfterCommonMixing(ClassWithSimpleMixin);
            });

            this.describe('mixin as instance of Mixin', function () {
                var ExtendedMixin = new Mixin(MixinContent),
                    ClassWithExtendedMixin = Backbone.Model.mix(ExtendedMixin).extend(ClassProto);
                this._checkInstancePropertiesAfterCommonMixing(ClassWithExtendedMixin);
            });
        },

        /**
         * @param {Function} Class
         * @private
         */
        _checkInstancePropertiesAfterCommonMixing: function (Class) {
            this.it('should just extend a class prototype', function () {
                expect(Class.prototype.mixedProp).to.be('mixed prop');
                expect(Class.prototype.prop).to.be('class prop');
                var instance = new Class;
                expect(instance.mixedProp).to.be('mixed prop');
                expect(instance.prop).to.be('class prop');
            });

            this.it('should have properties with lesser priority than class properties', function () {
                var instance = new Class;
                expect(instance.mixedProp2).to.be('redefined prop 2');
            });
        },

        /**
         * @private
         */
        _checkMixingWithDependencies: function () {
            this.it('should provide ability to mix the mixin itself and all its dependencies', function () {
                var Mixin1 = {
                    mixedProp1: 'mixed prop 1'
                };

                var Mixin2 = new Mixin({
                    dependencies: [Mixin1]
                }, {
                    mixedProp2: 'mixed prop 2'
                });

                var Class = Backbone.Model.mix(Mixin2).extend({
                    classProp: 'class prop'
                });

                var instance = new Class;

                expect(instance.mixedProp1).to.be('mixed prop 1');
                expect(instance.mixedProp2).to.be('mixed prop 2');
                expect(instance.classProp).to.be('class prop');
            });

            this.it('should not mix the same mixin twice', function () {
                var Mixin1 = {prop: 1},
                    Mixin2 = new Mixin({dependencies: [Mixin1]}, {prop: 2}),
                    Mixin3 = new Mixin({dependencies: [Mixin2, Mixin1]}, {}),
                    Class = Backbone.Model.mix(Mixin3).extend({});

                expect(Class.mixed).to.eql([Mixin1, Mixin2.proto, Mixin3.proto]);
                expect(new Class().prop).to.be(2);
            });
        },

        /**
         * @private
         */
        _checkStaticProperties: function () {
            this.it('should be applied to mixins', function () {
                var mixin = new Mixin({}, {}, {staticProp: 'prop'});
                expect(mixin.staticProp).to.be('prop');
            });
        }
    });
});
