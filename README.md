# Ember CLI Async Button

[See a demo](http://jsbin.com/vijen/1)

[![Build](https://travis-ci.org/dockyard/ember-cli-async-button.svg?branch=master)](https://travis-ci.org/dockyard/ember-cli-async-button)

## About ##

When running async actions ensuring disabling of the button,
re-enabling, and handling promise rejections is pretty boilerplate. This
component packages up that behavior.

## Install ##

```bash
npm install ember-cli-async-button --save-dev
```

## Usage ##

In a template use the `async-button` helper

```handlebars
{{async-button action="save" default="Save" pending="Saving..."}}
{{! or if you have arguments to be passed to the action}}
{{async-button model "another agrument" ... action="save" default="Save" pending="Saving..."}}
```

The component can also take a block:

```handlebars
{{#async-button action="save"}}
  Template content.
{{/async-button}}
```

In the controller for the template, you must create an action that matches the name
given in the helper. If you passed the helper arguments, they will
follow the callback argument.

```js
Ember.Controller.extend({
  actions: {
    save: function(callback) {
      var promise = this.get('model').save();

      callback(promise);

      promise.then(function() {
        ...
      });
    }
    // If you passed async-button arguments
    save: function(callback, firstArg, secondArg, ...) {
      var promise = this.get('model').save();

      callback(promise);

      promise.then(function() {
        ...
      });
    }
  }
});
```

Make special note of `callback(promise);` In order for
`async-button` to work correctly the promise in the action must be
passed back to the `callback` function that is passed in.

### Options ###

The `async-button` helper has other options to customize the states.

#### `action` ####

This is the action name used by the button.

#### `default` ####

The default text used for the button.

#### `pending` ####

Special text  used while the promise is running. If not provided will use the `default` value.

#### `resolved` ####

*Deprecated! Use [fulfilled](#fulfilled)*

Special text  used if the promise is resolved. If not provided will use the `default` value.

#### `fulfilled` ####

Special text  used if the promise is fulfilled. If not provided will use the `default` value.

#### `rejected` ####

Special text  used if the promise is rejected. If not provided will use the `default` value.

#### `reset` ####

Flag telling the button to reset to the default state once `resolved` or `rejected`. A typical use case is to bind this attribute with ember-data `isDirty` flag.

### Styling ###

A class of `async-button` is assigned to the button. An additional
dynamic class is assigned during one of the four states:

* `default`
* `pending`
* `fulfilled`
* `rejected`

## Authors ##

* [Brian Cardarella](http://twitter.com/bcardarella)

[We are very thankful for the many contributors](https://github.com/dockyard/ember-cli-async-button/graphs/contributors)

## Versioning ##

This library follows [Semantic Versioning](http://semver.org)

## Want to help? ##

Please do! We are always looking to improve this gem. Please see our
[Contribution Guidelines](https://github.com/dockyard/ember-cli-async-button/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](http://dockyard.com), Inc &copy; 2014

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
