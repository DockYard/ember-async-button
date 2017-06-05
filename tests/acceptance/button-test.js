import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let AppController;

const {
  RSVP: { Promise, reject, resolve },
  set,
  run
} = Ember;

moduleForAcceptance('Acceptance | AsyncButton', {
  beforeEach() {
    AppController = this.application.__container__.lookup('controller:application');
  },
  afterEach() {
    AppController = null;
  }
});

test('button resolves', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('button.async-button', 'Save');
    run(() => click('button.async-button'));
    assert.contains('button.async-button', 'Saving...');
  });

  andThen(function() {
    assert.contains('button.async-button', 'Saved!');
  });
});

test('button bound to controller promise resolves', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('#promise-bound button.async-button', 'Save');
    set(AppController, 'promise', resolve());
  });

  andThen(function() {
    assert.contains('#promise-bound button.async-button', 'Saved!');
  });
});

test('parameters passed to the helper are passed to the action', function(assert) {
  visit('/');

  assert.equal(AppController.get('actionArgument1'), undefined);
  assert.equal(AppController.get('actionArgument2'), undefined);
  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(function() {
    click('button.arg-button');
  });

  andThen(function() {
    assert.equal(AppController.get('actionArgument1'), 'argument 1');
    assert.equal(AppController.get('actionArgument2'), 'argument 2');
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });
});

test('dynamic parameters passed to the helper are passed to the action', function(assert) {
  visit('/');

  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(function() {
    click('button.arg-button');
  });

  andThen(function() {
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });

  andThen(function() {
    set(AppController, 'dynamicArgument', 'changed argument');
  });
  click('button.arg-button');

  andThen(function() {
    assert.equal(AppController.get('actionArgument3'), 'changed argument');
  });
});

test('button bound to controller promise fails', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('#promise-bound button.async-button', 'Save');
    set(AppController, 'promise', reject());
  });

  andThen(function() {
    assert.contains('#promise-bound button.async-button', 'Fail!');
  });
});

test('app should not crash due to a race condition on resolve', function(assert) {
  let resolve;
  let promise = new Promise(function(r) {
    resolve = r;
  });
  set(AppController, 'shown', true);
  visit('/');

  andThen(function() {
    set(AppController, 'promise', promise);
    set(AppController, 'shown', false);
  });

  andThen(function() {
    resolve();
    assert.ok(true, 'App should not crash due to a race condition on resolve');
  });
});

test('app should not crash due to a race condition on reject', function(assert) {
  let reject;
  let promise = new Promise(function(resolve, r) {
    reject = r;
  });
  set(AppController, 'shown', true);
  visit('/');

  andThen(function() {
    set(AppController, 'promise', promise);
    set(AppController, 'shown', false);
  });

  andThen(function() {
    reject();
    assert.ok(true, 'App should not crash due to a race condition on reject');
  });
});

test('button fails', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('button.async-button', 'Save');
    click('.rejectPromise');
  });

  andThen(function() {
    run(() => click('button.async-button'));
    assert.contains('button.async-button', 'Saving...');
  });

  andThen(function() {
    assert.contains('button.async-button', 'Fail!');
  });
});

test('button type is set', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('#set-type button.async-button[type="submit"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="button"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="reset"]').length, 1);
  });
});

test('button reset', function(assert) {
  visit('/');
  click('button.async-button');

  andThen(function() {
    assert.contains('button.async-button', 'Saved!');
    click('.dirtyState');
    assert.contains('button.async-button', 'Save');
    click('.dirtyState');
    click('button.async-button');
  });

  andThen(function() {
    assert.contains('button.async-button', 'Saved!');
  });
});

test('Can render a template instead', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('button.template', 'This is the template content.');
  });
});

test('tabindex is respected', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('#tabindex button').attr('tabindex'), 4);
  });
});

test('Block form yields correctly', function(assert) {
  let buttonSelector = '#accepts-block button';
  visit('/');

  andThen(function() {
    assert.contains(buttonSelector, 'Save');
    click(buttonSelector);
  });

  andThen(function() {
    assert.contains(buttonSelector, 'Saved!');
  });
});

test('Yield state', function(assert) {
  visit('/');

  andThen(function() {
    assert.contains('#state-yield button.async-button', 'default');
  });

  andThen(function() {
    run(()=> click('#state-yield button.async-button'));
    assert.contains('#state-yield button.async-button', 'pending');
  });

  andThen(function() {
    run(()=> set(AppController, 'promise', reject()));
    assert.contains('#state-yield button.async-button', 'rejected');
  });

  andThen(function() {
    run(()=> set(AppController, 'promise', resolve()));
    assert.contains('#state-yield button.async-button', 'fulfilled');
  });
});
