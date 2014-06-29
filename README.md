# Ember CLI Async Button

## Install ##

```bash
npm install ember-cli-async-button --save-dev
```

## Usage ##

In a template use the `async-button` helper

```handlebars
{{async-button action="save" default="Save" pending="Saving..."}}
```

In the controller for the template you must create an action that matches the name 
given in the helper.

```js
Ember.Controller.extend({
  actions: {
    save: function() {
      var promise = this.get('model').save();

      this.set('savePromise', promise);

      promise.then(function() {
        ...
      });
    }
  }
});
```

Make special note of `this.set('savePromise', promise);` In order for
`async-button` to work correctly the promise in the action must be
assigned to the property of `<actionName>Promise`. So if you are using
an action named `destroy` you need to assign to `destroyPromise`.

### Options ###

The `async-button` helper has other options to customize the states.

#### `action` ####

This is the action name used by the button.

#### `default` ####

The default text used for the button.

#### `pending` ####

Special text  used while the promise is running. If not provided will default
to the `default` value.

#### `resolved` ####

Special text  used if the promise is resolved. If not provided will default
to the `default` value.

#### `rejected` ####

Special text  used if the promise is rejected. If not provided will default
to the `default` value.

### Styling ###

A class of `async-button` is assigned to the button. An additional
dynamic class is assigned during one of the four states:

* `default`
* `pending`
* `resolved`
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
