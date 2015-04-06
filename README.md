backbone.mix
============
Mixins implementation for Backbone

[![Build Status](https://travis-ci.org/backbonex/backbone.mix.svg?branch=master)](https://travis-ci.org/backbonex/backbone.mix)
[![Coverage Status](https://coveralls.io/repos/backbonex/backbone.mix/badge.svg?branch=master)](https://coveralls.io/r/backbonex/backbone.mix?branch=master)

Quick start with mixing
-----------------------
Mixin can be a simple object
```js
var Editable = {
    edit: function(){
        console.log('edit');
    }
};
```
and you can mix it into any class inherited from [Backbone](http://backbonejs.org/) view, model etc.
```js
var Article = Backbone.Model.mix(Editable).extend({
    initialize: function(){
        Backbone.Model.prototype.initialize.call(this);
        this.edit(); // logs "edit"
    }
});
```
Mixing more than one mixin
--------------------------
Of course you can mix as many mixins as you want like this:
```js
var Article = Backbone.Model.mix(
    Editable, 
    Writable,
    WithLogger
).extend( ... );
```
Mixing to child class
-------------------------
`mix` is inherited as well as any other static method of Backbone classes, so you can use it with child classes
```js
var Post = Article.mix(WithComments).extend( ... );
```
Mixins can depend on other mixins
---------------------------------
It's very frequent situation when one mixin wants to use methods of other one. Suppose `WithComments` need to log something using `log` method of `WithLogger`. Then the declaration of `WithComments` becomes a bit more complex:
```js
var WithComments = new Mixin({
    dependencies: [WithLogger]
}, {
    initComments: function() {
        this.log('init comments');
    }
});
```
Now mixing `WithComments` automatically mixes `WithLogger`
```js
var Post = Article.mix(WithComments).extend( ... );
var post = new Post;
post.log('something');
```
Installation
------------
To install latest version just type:
```sh
> bower install backbone.mix --save
```
If you do not have bower:
```sh
> npm install -g bower
```
Inclusion
---------
You have two ways to include the script
### Using globals
Just add script tags with `Mixin` and `Backbone.Mix` right after Backbone:
```html
<script src="path/to/backbone.js"></script>
<script src="path/to/Mixin.js"></script>
<script src="path/to/Backbone.Mix.js"></script>
```
### Using AMD loader, for example [RequireJS](requirejs.org)
Add info about jQuery and Backbone locations to the [shim](http://requirejs.org/docs/api.html#config-shim)
```js
requirejs.config({
    paths: {
        backbone: 'path/to/backbone',
        jquery: 'path/to/jquery'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        }
    }
});
```
Add `Backbone.Mix` to the list of dependencies when you want to use `mix` method
```js
require([
    'path/to/bakbone', 
    'path/to/Backbone.Mix'
], function (Backbone) {
    var SomeFeature = {
        doAmazingStuff: function(){}
    };
    
    var MyView = Backbone.View.mix(SomeFeature).extend({
        // your view prototype here
    });
});
```
Add `Mixin` to the dependencies when you need to create a complex mixin
```js
define([
    'path/to/Mixin'
], function (Mixin) {
    var MyMixin = new Mixin({
        dependencies: [...]
    }, {
        // mixing properties
    }, {
        // static properties for the mixin
    });
    
    return MyMixin;
});
```
How it works
------------
When you mix something you create a new temporary class which is placed between base class and child class in the prototype chain. In other words if you have class A and class B inherited from A with mixed M your prototype chain looks like this
```
Class A
  |
Tmp Class with M as a prototype
  |
Class B
```
If M depends on M2:
```
Class A
  |
Tmp Class with M2 as a prototype
  |
Tmp Class with M as a prototype
  |
Class B
```
### Mix your brain?
