import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import contains from '../helpers/contains';

const {
  RSVP: { Promise: EmberPromise, reject, resolve },
  run
} = Ember;

let App, AppController;

module('Acceptance: AsyncButton', {
  setup() {
    App = startApp();
    AppController = App.__container__.lookup('controller:application');
  },

  teardown() {
    AppController.set('actionArgument1', undefined);
    AppController.set('actionArgument2', undefined);
    AppController.set('actionArgument3', undefined);
    run(App, 'destroy');
  }
});

test('button resolves', () => {
  visit('/');

  andThen(() => {
    contains(find('button.async-button'), 'Save');
    click('button.async-button');
  });

  andThen(() => {
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(() => {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('button bound to controller promise resolves', () => {
  visit('/');

  andThen(() => {
    contains(find('#promise-bound button.async-button'), 'Save');
    AppController.set('promise', resolve());
  });

  andThen(() => {
    contains(find('#promise-bound button.async-button'), 'Saved!');
  });
});

test('parameters passed to the helper are passed to the action', (assert) => {
  visit('/');

  assert.equal(AppController.get('actionArgument1'), undefined);
  assert.equal(AppController.get('actionArgument2'), undefined);
  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(() => {
    click('button.arg-button');
  });

  andThen(() => {
    assert.equal(AppController.get('actionArgument1'), 'argument 1');
    assert.equal(AppController.get('actionArgument2'), 'argument 2');
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });
});

test('dynamic parameters passed to the helper are passed to the action', (assert) => {
  visit('/');

  assert.equal(AppController.get('actionArgument3'), undefined);

  andThen(() => {
    click('button.arg-button');
  });

  andThen(() => {
    assert.equal(AppController.get('actionArgument3'), 'argument 3');
  });

  andThen(() => {
    AppController.set('dynamicArgument', 'changed argument');
  });
  click('button.arg-button');

  andThen(() => {
    assert.equal(AppController.get('actionArgument3'), 'changed argument');
  });
});

test('button bound to controller promise fails', () => {
  visit('/');

  andThen(() => {
    contains(find('#promise-bound button.async-button'), 'Save');
    AppController.set('promise', reject());
  });

  andThen(() => {
    contains(find('#promise-bound button.async-button'), 'Fail!');
  });
});

test('app should not crash due to a race condition on resolve', (assert) => {
  let resolve;
  const promise = new EmberPromise((r) => {
    resolve = r;
  });
  AppController.set('shown', true);
  visit('/');

  andThen(() => {
    AppController.set('promise', promise);
    AppController.set('shown', false);
  });

  andThen(() => {
    resolve();
    assert.ok(true, 'App should not crash due to a race condition on resolve');
  });
});

test('app should not crash due to a race condition on reject', (assert) => {
  let reject;
  const promise = new EmberPromise((resolve, r) => {
    reject = r;
  });
  AppController.set('shown', true);
  visit('/');

  andThen(() => {
    AppController.set('promise', promise);
    AppController.set('shown', false);
  });

  andThen(() => {
    reject();
    assert.ok(true, 'App should not crash due to a race condition on reject');
  });
});

test('button fails', (assert) => {
  visit('/');

  andThen(() => {
    contains(find('button.async-button'), 'Save');
    click('.rejectPromise');
  });

  andThen(() => {
    click('button.async-button');
  });

  andThen(() => {
    contains(find('button.async-button'), 'Saving...');
  });

  andThen(() => {
    contains(find('button.async-button'), 'Fail!');
  });
});

test('button type is set', (assert) => {
  visit('/');

  andThen(() => {
    assert.equal(find('#set-type button.async-button[type="submit"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="button"]').length, 1);
    assert.equal(find('#set-type button.async-button[type="reset"]').length, 1);
  });
});

test('button reset', (assert) => {
  visit('/');
  click('button.async-button');

  andThen(() => {
    contains(find('button.async-button'), 'Saved!');
    click('.dirtyState');
    contains(find('button.async-button'), 'Save');
    click('.dirtyState');
    click('button.async-button');
  });

  andThen(() => {
    contains(find('button.async-button'), 'Saved!');
  });
});

test('Can render a template instead', (assert) => {
  visit('/');

  andThen(() => {
    contains(find('button.template'), 'This is the template content.');
  });
});

test('Block form yields correctly', (assert) => {
  const buttonSelector = '#accepts-block button';
  visit('/');

  andThen(() => {
    contains(find(buttonSelector), 'Save');
    click(buttonSelector);
  });

  andThen(() => {
    contains(find(buttonSelector), 'Saved!');
  });
});
