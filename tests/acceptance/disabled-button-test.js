import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

let App, DisabledController;

const {
  set,
  run
} = Ember;

module('Acceptance: Disabled AsyncButton', {
  beforeEach() {
    App = startApp();
    DisabledController = App.__container__.lookup('controller:disabled');
  },
  afterEach() {
    set(DisabledController, 'actionArgument1', undefined);
    set(DisabledController, 'actionArgument2', undefined);
    set(DisabledController, 'actionArgument3', undefined);
    run(App, 'destroy');
  }
});

test('button works with custom disabled conditional', function(assert) {
  visit('/disabled');

  andThen(function() {
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
    contains(find('#custom-disabled button'), 'Save');
  });
  fillIn('#custom-disabled input', 'x');
  andThen(function() {
    assert.equal(find('#custom-disabled button').is(':disabled'), false);
    contains(find('#custom-disabled button'), 'Save');
  });

  click('#custom-disabled button');
  andThen(function() {
    contains(find('#custom-disabled button'), 'Saving...');
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
    set(DisabledController, 'promise', Ember.RSVP.resolve());
  });

  andThen(function() {
    contains(find('#custom-disabled button'), 'Save');
    assert.equal(find('#custom-disabled button').is(':disabled'), false);
    fillIn('#custom-disabled input', '');
  });

  andThen(function() {
    contains(find('#custom-disabled button'), 'Save');
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
  });
});
