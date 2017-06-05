import { click, fillIn, visit } from 'ember-native-dom-helpers';
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let DisabledController;

const {
  RSVP: { resolve },
  set,
  run
} = Ember;

moduleForAcceptance('Acceptance | Disabled AsyncButton', {
  beforeEach() {
    DisabledController = this.application.__container__.lookup('controller:disabled');
  },
  afterEach() {
    DisabledController = null;
  }
});

test('button works with custom disabled conditional', async function(assert) {
  await visit('/disabled');

  assert.equal(find('#custom-disabled button').is(':disabled'), true);
  assert.contains('#custom-disabled button', 'Save');
  await fillIn('#custom-disabled input', 'x');
  assert.equal(find('#custom-disabled button').is(':disabled'), false);
  assert.contains('#custom-disabled button', 'Save');

  await click('#custom-disabled button');
  assert.contains('#custom-disabled button', 'Saving...');
  assert.equal(find('#custom-disabled button').is(':disabled'), true);
  run(() => set(DisabledController, 'promise', resolve()));
  assert.contains('#custom-disabled button', 'Save');
  assert.equal(find('#custom-disabled button').is(':disabled'), false);
  await fillIn('#custom-disabled input', '');
  assert.contains('#custom-disabled button', 'Save');
  assert.equal(find('#custom-disabled button').is(':disabled'), true);
});
