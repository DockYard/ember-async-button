import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const {
  RSVP: { Promise, resolve, reject }
} = Ember;

moduleForComponent('async-button', 'Integration | Component | async button', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(4);

  this.set('save', (callback) => callback(resolve()));

  this.render(hbs`
    {{#async-button action=(action save) as |button|}}
      {{#if button.isDefault}}
        Save
      {{else if button.isPending}}
        I am pending!
      {{else if button.isFulfilled}}
        Success
      {{else if button.isRejected}}
       Error: darnit
      {{/if}}
    {{/async-button}}
  `);

  assert.equal(this.$().text().trim(), 'Save');
  this.$('button').click();
  assert.equal(this.$().text().trim(), 'Success');

  this.set('save', (callback) => callback(reject()));
  this.$('button').click();
  assert.equal(this.$().text().trim(), 'Error: darnit');

  this.set('save', (callback) => callback(new Promise(() => {})));
  this.$('button').click();
  assert.equal(this.$().text().trim(), 'I am pending!');
});
