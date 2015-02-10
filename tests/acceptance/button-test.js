import Ember from 'ember';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

var App, AppController;

module('Acceptance: AsyncButton', {
  setup: function() {
    App = startApp();
    AppController = App.__container__.lookup("controller:application");
  },
  teardown: function() {
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

test('app should not crash due to a race condition on resolve', function() {
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
    ok(true, "App should not crash due to a race condition on resolve");
  });
});

test('app should not crash due to a race condition on reject', function() {
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
    ok(true, "App should not crash due to a race condition on reject");
  });
});

test('button fails', function() {
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

test('button type is set', function() {
  visit('/');

  andThen(function() {
    equal(find('#set-type button.async-button[type="submit"]').length, 1);
    equal(find('#set-type button.async-button[type="button"]').length, 1);
    equal(find('#set-type button.async-button[type="reset"]').length, 1);
  });
});

test('button reset', function() {
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

test('Can render a template instead', function() {
  visit('/');

  andThen(function() {
    contains(find('button.template'), 'This is the template content.');
  });
});

