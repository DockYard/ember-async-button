import Ember from 'ember';
import startApp from '../helpers/start-app';

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
    ok(Ember.$('button.async-button').text().indexOf('Save') > -1);
    click('button.async-button');
    ok(Ember.$('button.async-button').text().indexOf('Saving...') > -1);
    Ember.run.later(function() {
      ok(Ember.$('button.async-button').text().indexOf('Saved!') > -1);
    }, 50);
  });
});

test('button fails', function() {
  visit('/');

  andThen(function() {
    ok(Ember.$('button.async-button').text().indexOf('Save') > -1);
    click('.rejectPromise');
    andThen(function() {
      click('button.async-button');
      ok(Ember.$('button.async-button').text().indexOf('Saving...') > -1);
      Ember.run.later(function() {
        ok(Ember.$('button.async-button').text().indexOf('Fail!') > -1);
      }, 20);
    });
  });
});

test('button type is set', function() {
  visit('/');

  andThen(function() {
    ok(Ember.$('button.async-button[type="submit"]').length === 2);
    ok(Ember.$('button.async-button[type="button"]').length === 1);
    ok(Ember.$('button.async-button[type="reset"]').length === 1);
  });
});

test('Can render a template instead', function() {
  visit('/');

  andThen(function() {
    ok(Ember.$('button.template').text().indexOf('This is the template content.') > -1);
  });
});

