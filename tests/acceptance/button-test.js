import { resolve, reject, Promise } from 'rsvp';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import {
  find,
  click,
  findAll,
  visit,
  waitUntil
} from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let AppController;

moduleForAcceptance('Acceptance | AsyncButton', {
  beforeEach() {
    AppController = this.application.__container__.lookup('controller:application');
  },
  afterEach() {
    AppController = null;
  }
});

test('button resolves', async function(assert) {
  await visit('/');

  assert.contains('button.async-button', 'Save');
  let promise = click('button.async-button');
  assert.contains('button.async-button', 'Saving...');
  await promise;
  assert.contains('button.async-button', 'Saved!');
});

test('button bound to controller promise resolves', async function(assert) {
  await visit('/');

  assert.contains('#promise-bound button.async-button', 'Save');
  run(() => set(AppController, 'promise', resolve()));
  await waitUntil(() => find('#promise-bound button.async-button').textContent.indexOf('Saved!') > -1)
  assert.contains('#promise-bound button.async-button', 'Saved!');
});

test('parameters passed to the helper are passed to the action', async function(assert) {
  await visit('/');

  assert.equal(AppController.get('actionArgument1'), undefined);
  assert.equal(AppController.get('actionArgument2'), undefined);
  assert.equal(AppController.get('actionArgument3'), undefined);

  await click('button.arg-button');
  assert.equal(AppController.get('actionArgument1'), 'argument 1');
  assert.equal(AppController.get('actionArgument2'), 'argument 2');
  assert.equal(AppController.get('actionArgument3'), 'argument 3');
});

test('dynamic parameters passed to the helper are passed to the action', async function(assert) {
  await visit('/');

  assert.equal(AppController.get('actionArgument3'), undefined);

  await click('button.arg-button');

  assert.equal(AppController.get('actionArgument3'), 'argument 3');

  run(() => set(AppController, 'dynamicArgument', 'changed argument'));
  await click('button.arg-button');

  assert.equal(AppController.get('actionArgument3'), 'changed argument');
});

test('button bound to controller promise fails', async function(assert) {
  await visit('/');

  assert.contains('#promise-bound button.async-button', 'Save');
  run(() => set(AppController, 'promise', reject()));
  await waitUntil(() => find('#promise-bound button.async-button').textContent.indexOf('Fail!') > -1)
  assert.contains('#promise-bound button.async-button', 'Fail!');
});

test('app should not crash due to a race condition on resolve', async function(assert) {
  let resolve;
  let promise = new Promise(function(r) {
    resolve = r;
  });
  run(() => set(AppController, 'shown', true));
  await visit('/');

  run(() => set(AppController, 'promise', promise));
  run(() => set(AppController, 'shown', false));
  resolve();
  assert.ok(true, 'App should not crash due to a race condition on resolve');
});

test('app should not crash due to a race condition on reject', async function(assert) {
  let reject;
  let promise = new Promise(function(resolve, r) {
    reject = r;
  });
  run(() => set(AppController, 'shown', true));
  await visit('/');

  run(() => set(AppController, 'promise', promise));
  run(() => set(AppController, 'shown', false));
  reject();
  assert.ok(true, 'App should not crash due to a race condition on reject');
});

test('button fails', async function(assert) {
  await visit('/');

  assert.contains('button.async-button', 'Save');
  await click('.rejectPromise');
  click('button.async-button');
  await waitUntil(() => find('button.async-button').textContent.indexOf('Saving...') > -1);
  assert.contains('button.async-button', 'Saving...');
  await waitUntil(() => find('button.async-button').textContent.indexOf('Fail!') > -1);
  assert.contains('button.async-button', 'Fail!');
});

test('button type is set', async function(assert) {
  await visit('/');

  assert.equal(findAll('#set-type button.async-button[type="submit"]').length, 1);
  assert.equal(findAll('#set-type button.async-button[type="button"]').length, 1);
  assert.equal(findAll('#set-type button.async-button[type="reset"]').length, 1);
});

test('button reset', async function(assert) {
  await visit('/');
  await click('button.async-button');

  assert.contains('button.async-button', 'Saved!');
  await click('.dirtyState');
  assert.contains('button.async-button', 'Save');
  await click('.dirtyState');
  await click('button.async-button');
  assert.contains('button.async-button', 'Saved!');
});

test('Can render a template instead', async function(assert) {
  await visit('/');

  assert.contains('button.template', 'This is the template content.');
});

test('tabindex is respected', async function(assert) {
  await visit('/');

  assert.equal(find('#tabindex button').getAttribute('tabindex'), 4);
});

test('Block form yields correctly', async function(assert) {
  let buttonSelector = '#accepts-block button';
  await visit('/');

  assert.contains(buttonSelector, 'Save');
  await click(buttonSelector);
  assert.contains(buttonSelector, 'Saved!');
});

test('Yield state', async function(assert) {
  await visit('/');

  assert.contains('#state-yield button.async-button', 'default');
  await click('#state-yield button.async-button');
  assert.contains('#state-yield button.async-button', 'pending');
  run(()=> set(AppController, 'promise', reject()));
  await waitUntil(() => find('#state-yield button.async-button').textContent.indexOf('rejected') > -1);
  assert.contains('#state-yield button.async-button', 'rejected');
  run(()=> set(AppController, 'promise', resolve()));
  await waitUntil(() => find('#state-yield button.async-button').textContent.indexOf('fulfilled') > -1);
  assert.contains('#state-yield button.async-button', 'fulfilled');
});
