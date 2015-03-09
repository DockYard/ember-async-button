import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

var App, AppController;

module('Acceptance: AsyncButton', {
  setup: function() {
    App = startApp();
    AppController = App.__container__.lookup("controller:application");
  },
  teardown: function() {
    AppController.set('actionArgument1', undefined);
    AppController.set('actionArgument2', undefined);
    AppController.set('actionArgument3', undefined);
    Ember.run(App, 'destroy');
  }
});

test('button resolves', function() {
  visit('/');

  andThen(function() {
    contains(find('button.async-button'), 'Save');
    click('button.async-button');
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('button bound to controller promise resolves', function() {
  visit('/');

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Save');
    AppController.set("promise", Ember.RSVP.resolve());
  });

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Saved!');
  });
});

test('parameters passed to the helper are passed to the action', function(assert) {
  visit('/');

  assert.equal(AppController.get('actionArgument1'), undefined);
  assert.equal(AppController.get('actionArgument2'), undefined);
  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(function() {
    click('button.arg-button');
  });

  andThen(function() {
    assert.equal(AppController.get('actionArgument1'), 'argument 1');
    assert.equal(AppController.get('actionArgument2'), 'argument 2');
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });
});

test('dynamic parameters passed to the helper are passed to the action', function(assert) {
  visit('/');

  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(function() {
    click('button.arg-button');
  });

  andThen(function() {
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });

  andThen(function() {
    AppController.set('dynamicArgument', 'changed argument');
  });
  click('button.arg-button');

  andThen(function() {
    assert.equal(AppController.get('actionArgument3'), 'changed argument');
  });
});

test('button bound to controller promise fails', function() {
  visit('/');

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Save');
    AppController.set("promise", Ember.RSVP.reject());
  });

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Fail!');
  });
});

test('app should not crash due to a race condition on resolve', function(assert) {
  var resolve,
  promise = new Ember.RSVP.Promise(function(r) {
    resolve = r;
  });
  AppController.set('shown', true);
  visit('/');

  andThen(function() {
    AppController.set("promise", promise);
    AppController.set('shown', false);
  });

  andThen(function() {
    resolve();
    assert.ok(true, "App should not crash due to a race condition on resolve");
  });
});

test('app should not crash due to a race condition on reject', function(assert) {
  var reject,
  promise = new Ember.RSVP.Promise(function(resolve, r) {
    reject = r;
  });
  AppController.set('shown', true);
  visit('/');

  andThen(function() {
    AppController.set("promise", promise);
    AppController.set('shown', false);
  });

  andThen(function() {
    reject();
    assert.ok(true, "App should not crash due to a race condition on reject");
  });
});

test('button fails', function(assert) {
  visit('/');

  andThen(function() {
    contains(find('button.async-button'), 'Save');
    click('.rejectPromise');
  });

  andThen(function() {
    click('button.async-button');
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Fail!');
  });
});

test('button type is set', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('#set-type button.async-button[type="submit"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="button"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="reset"]').length, 1);
  });
});

test('button reset', function(assert) {
  visit('/');
  click('button.async-button');

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
    click('.dirtyState');
    contains(find('button.async-button'), 'Save');
    click('.dirtyState');
    click('button.async-button');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('Can render a template instead', function(assert) {
  visit('/');

  andThen(function() {
    contains(find('button.template'), 'This is the template content.');
  });
});

