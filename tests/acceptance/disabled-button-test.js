import { resolve } from 'rsvp';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import { click, find, fillIn, visit } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let DisabledController;

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

  assert.equal(find('#custom-disabled button').disabled, true);
  assert.contains('#custom-disabled button', 'Save');
  await fillIn('#custom-disabled input', 'x');
  assert.equal(find('#custom-disabled button').disabled, false);
  assert.contains('#custom-disabled button', 'Save');

  await click('#custom-disabled button');
  assert.contains('#custom-disabled button', 'Saving...');
  assert.equal(find('#custom-disabled button').disabled, true);
  run(() => set(DisabledController, 'promise', resolve()));
  assert.contains('#custom-disabled button', 'Save');
  assert.equal(find('#custom-disabled button').disabled, false);
  await fillIn('#custom-disabled input', '');
  assert.contains('#custom-disabled button', 'Save');
  assert.equal(find('#custom-disabled button').disabled, true);
});
