import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let DisabledController;

const {
  RSVP: { resolve },
  set
} = Ember;

moduleForAcceptance('Acceptance | Disabled AsyncButton', {
  beforeEach() {
    DisabledController = this.application.__container__.lookup('controller:disabled');
  },
  afterEach() {
    DisabledController = null;
  }
});

test('button works with custom disabled conditional', function(assert) {
  visit('/disabled');

  andThen(function() {
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
    assert.contains('#custom-disabled button', 'Save');
  });
  fillIn('#custom-disabled input', 'x');
  andThen(function() {
    assert.equal(find('#custom-disabled button').is(':disabled'), false);
    assert.contains('#custom-disabled button', 'Save');
  });

  click('#custom-disabled button');
  andThen(function() {
    assert.contains('#custom-disabled button', 'Saving...');
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
    set(DisabledController, 'promise', resolve());
  });

  andThen(function() {
    assert.contains('#custom-disabled button', 'Save');
    assert.equal(find('#custom-disabled button').is(':disabled'), false);
    fillIn('#custom-disabled input', '');
  });

  andThen(function() {
    assert.contains('#custom-disabled button', 'Save');
    assert.equal(find('#custom-disabled button').is(':disabled'), true);
  });
});
