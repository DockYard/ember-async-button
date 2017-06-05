import { click, find } from 'ember-native-dom-helpers';
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const {
  RSVP: { Promise },
  run: { next },
  setProperties
} = Ember;

moduleForComponent('async-button', 'Integration | Component | async button', {
  integration: true
});

test('it responds to a fulfilled closure promise', async function(assert) {
  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving',
    fulfilled: 'Saved'
  });

  this.on('closurePromise', function() {
    return new Promise((fulfill) => {
      next(() => {
        fulfill();
      });
    });
  });

  this.render(hbs`{{async-button default=default pending=pending fulfilled=fulfilled action=(action "closurePromise")}}`);
  let promise = click('button');
  assert.equal(find('button').textContent.trim(), 'Saving');
  await promise;
  assert.equal(find('button').textContent.trim(), 'Saved');
});

test('it responds to a rejected closure promise', async function(assert) {
  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving',
    rejected: 'Retry Save'
  });

  this.on('closurePromise', function() {
    return new Promise((fulfill, reject) => {
      next(() => {
        reject();
      });
    });
  });

  this.render(hbs`{{async-button default=default pending=pending rejected=rejected action=(action "closurePromise")}}`);
  let promise = click('button');

  assert.equal(find('button').textContent.trim(), 'Saving');
  await promise;
  assert.equal(find('button').textContent.trim(), 'Retry Save');
});

test('closure actions can use the callback argument', async function(assert) {
  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving'
  });

  this.on('closurePromise', function(callback) {
    let promise = new Promise((fulfill) => {
      next(() => {
        fulfill();
      });
    });

    callback(promise);
  });

  this.render(hbs`{{async-button default=default pending=pending action=(action "closurePromise")}}`);
  let promise = click('button');

  assert.equal(find('button').textContent.trim(), 'Saving');
  await promise;
  assert.equal(find('button').textContent.trim(), 'Save');
});

test('closure actions receive positional params', async function(assert) {
  assert.expect(2);

  this.on('closurePromise', function(callback, param1, param2) {
    assert.equal(param1, 'foo');
    assert.equal(param2, 'bar');
  });

  this.render(hbs`{{async-button "foo" "bar" action=(action "closurePromise")}}`);
  await click('button');
});
