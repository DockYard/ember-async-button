# Ember Async Button

[See a demo](http://jsbin.com/qokogasilu/1)

[![Build Status](https://travis-ci.org/DockYard/ember-async-button.svg?branch=master)](https://travis-ci.org/DockYard/ember-async-button) [![CircleCI](https://circleci.com/gh/DockYard/ember-async-button.svg?style=shield)](https://circleci.com/gh/DockYard/ember-async-button) [![npm version](https://badge.fury.io/js/ember-async-button.svg)](https://badge.fury.io/js/ember-async-button) [![Ember Observer Score](http://emberobserver.com/badges/ember-async-button.svg)](http://emberobserver.com/addons/ember-async-button)
## About ##

When running async actions ensuring disabling of the button,
re-enabling, and handling promise rejections is pretty boilerplate. This
component packages up that behavior.

## Install ##

```bash
ember install ember-async-button
```

## Usage ##

In a template use the `async-button` helper

```handlebars
{{async-button action=(action "save" model) default="Save" pending="Saving..."}}
```

The component can also take a block:

```handlebars
{{#async-button action=(action "save")}}
  Template content.
{{/async-button}}
```

The closure action passed should return a promise:
```js
import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  actions: {
    save(model) {
      return model.save();
    }
  }
});
```

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

#### `disableWhen` ####

Boolean value that will allow for disabling the button when in a state other than `pending`

#### `reset` ####

Flag telling the button to reset to the default state once `resolved` or `rejected`. A typical use case is to bind this attribute with ember-data `isDirty` flag.

### Styling ###

A class of `async-button` is assigned to the button. An additional
dynamic class is assigned during one of the four states:

* `default`
* `pending`
* `fulfilled`
* `rejected`

### The `href` attribute of the `a` tag ###

You can adjust the button's tag by passing the `tagName` option:

```handlebars
{{async-button tagName="a" action="save" default="Save" pending="Saving..."}}
```

When you set `tagName` to `a`, the element will obtain an empty `href` attribute. This is necessary to enable the link behavior of the element, i. e. color, underlining and hover effect.

You can of course override `href` if you need it for some reason:

```handlebars
{{async-button tagName="a" href="custom" action="save" default="Save" pending="Saving..."}}
```

If you don't want a `href` attribute on your `a` button, set it to `false`:

```handlebars
{{async-button tagName="a" href=false action="save" default="Save" pending="Saving..."}}
```

## Authors ##

* [Brian Cardarella](http://twitter.com/bcardarella)

[We are very thankful for the many contributors](https://github.com/dockyard/ember-async-button/graphs/contributors)

## Versioning ##

This library follows [Semantic Versioning](http://semver.org)

## Want to help? ##

Please do! We are always looking to improve this addon. Please see our
[Contribution Guidelines](https://github.com/dockyard/ember-async-button/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](http://dockyard.com/ember-consulting), Inc &copy; 2014

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
