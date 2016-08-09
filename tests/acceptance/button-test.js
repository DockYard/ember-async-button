import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

let App, AppController;

const {
  RSVP: { Promise, reject, resolve },
  set,
  run
} = Ember;

module('Acceptance: AsyncButton', {
  setup() {
    App = startApp();
    AppController = App.__container__.lookup('controller:application');
  },
  teardown() {
    set(AppController, 'actionArgument1', undefined);
    set(AppController, 'actionArgument2', undefined);
    set(AppController, 'actionArgument3', undefined);
    run(App, 'destroy');
  }
});

test('button resolves', function() {
  visit('/');

  andThen(function() {
    contains(find('button.async-button'), 'Save');
    click('button.async-button');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('button bound to controller promise resolves', function() {
  visit('/');

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Save');
    set(AppController, 'promise', resolve());
  });

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Saved!');
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

test('button bound to controller promise fails', function() {
  visit('/');

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Save');
    set(AppController, 'promise', reject());
  });

  andThen(function() {
    contains(find('#promise-bound button.async-button'), 'Fail!');
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

test('button fails', function() {
  visit('/');

  andThen(function() {
    contains(find('button.async-button'), 'Save');
    click('.rejectPromise');
  });

  andThen(function() {
    click('button.async-button');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Fail!');
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

test('button reset', function() {
  visit('/');
  click('button.async-button');

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
    click('.dirtyState');
    contains(find('button.async-button'), 'Save');
    click('.dirtyState');
    click('button.async-button');
  });

  andThen(function() {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('Can render a template instead', function() {
  visit('/');

  andThen(function() {
    contains(find('button.template'), 'This is the template content.');
  });
});

test('tabindex is respected', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('#tabindex button').attr('tabindex'), 4);
  });
});

test('Block form yields correctly', function() {
  let buttonSelector = '#accepts-block button';
  visit('/');

  andThen(function() {
    contains(find(buttonSelector), 'Save');
    click(buttonSelector);
  });

  andThen(function() {
    contains(find(buttonSelector), 'Saved!');
  });
});
