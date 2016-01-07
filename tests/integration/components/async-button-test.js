import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

const {
  setProperties
} = Ember;

moduleForComponent('async-button', 'Integration | Component | async button', {
  integration: true
});

test('it responds to a fulfilled closure promise', function(assert) {
  let done = assert.async();

  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving',
    fulfilled: 'Saved'
  });

  this.on('closurePromise', function() {
    return new Ember.RSVP.Promise((fulfill) => {
      Ember.run.next(() => {
        fulfill();
      });
    });
  });

  this.render(hbs`{{async-button default=default pending=pending fulfilled=fulfilled action=(action "closurePromise")}}`);
  this.$('button').click();

  assert.equal(this.$('button').text().trim(), 'Saving');

  wait().then(() => {
    assert.equal(this.$('button').text().trim(), 'Saved');
    done();
  });
});

test('it responds to a rejected closure promise', function(assert) {
  let done = assert.async();

  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving',
    rejected: 'Retry Save'
  });

  this.on('closurePromise', function() {
    return new Ember.RSVP.Promise((fulfill, reject) => {
      Ember.run.next(() => {
        reject();
      });
    });
  });

  this.render(hbs`{{async-button default=default pending=pending rejected=rejected action=(action "closurePromise")}}`);
  this.$('button').click();

  assert.equal(this.$('button').text().trim(), 'Saving');

  wait().then(() => {
    assert.equal(this.$('button').text().trim(), 'Retry Save');
    done();
  });
});

test('closure actions can use the callback argument', function(assert) {
  let done = assert.async();

  assert.expect(2);

  setProperties(this, {
    default: 'Save',
    pending: 'Saving'
  });

  this.on('closurePromise', function(callback) {
    let promise = new Ember.RSVP.Promise((fulfill) => {
      Ember.run.next(() => {
        fulfill();
      });
    });

    callback(promise);
  });

  this.render(hbs`{{async-button default=default pending=pending action=(action "closurePromise")}}`);
  this.$('button').click();

  assert.equal(this.$('button').text().trim(), 'Saving');

  wait().then(() => {
    assert.equal(this.$('button').text().trim(), 'Save');
    done();
  });
});

test('closure actions receive positional params', function(assert) {
  assert.expect(2);

  this.on('closurePromise', function(callback, param1, param2) {
    assert.equal(param1, 'foo');
    assert.equal(param2, 'bar');
  });

  this.render(hbs`{{async-button "foo" "bar" action=(action "closurePromise")}}`);
  this.$('button').click();
});
