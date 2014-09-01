import Ember from 'ember';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

var App;

module('Acceptance: AsyncButton', {
  setup: function() {
    App = startApp();
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
    Ember.run.later(function() {
      contains(find('button.async-button'), 'Saved!');
    }, 50);
  });
});

test('button fails', function() {
  visit('/');

  andThen(function() {
    contains(find('button.async-button'), 'Save');
    click('.rejectPromise');
    andThen(function() {
      click('button.async-button');
      contains(find('button.async-button'), 'Saving...');
      Ember.run.later(function() {
        contains(find('button.async-button'), 'Fail!');
      }, 20);
    });
  });
});

test('button type is set', function() {
  visit('/');

  andThen(function() {
    equal(find('button.async-button[type="submit"]').length, 2);
    equal(find('button.async-button[type="button"]').length, 1);
    equal(find('button.async-button[type="reset"]').length, 1);
  });
});

test('Can render a template instead', function() {
  visit('/');

  andThen(function() {
    contains(find('button.template'), 'This is the template content.');
  });
});

