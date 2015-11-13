import Ember from 'ember';
import layout from '../templates/components/async-button';

const {
  get,
  set,
  computed,
  observer,
  deprecate,
  getWithDefault,
  Component
} = Ember;

let positionalParamsMixin = {
  positionalParams: 'params'
};

const ButtonComponent = Component.extend(positionalParamsMixin, {
  layout,
  tagName: 'button',
  promiseState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['promiseState'],
  attributeBindings: ['disabled', 'type', '_href:href', 'tabindex'],

  type: 'submit',
  disabled: computed('promiseState', 'disableWhen', function() {
    let promiseState = get(this, 'promiseState');
    let disableWhen = get(this, 'disableWhen');
    return disableWhen || promiseState === 'pending';
  }),

  click() {
    let params = getWithDefault(this, 'params', []);

    const callbackHandler = (promise) => {
      set(this, 'promise', promise);
    };

    let actionArguments = ['action', callbackHandler, ...params];

    this.sendAction(...actionArguments);
    set(this, 'promiseState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission without returning false to prevent action bubbling
    return false;
  },

  text: computed('promiseState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return getWithDefault(this, this.promiseState, get(this, 'default'));
  }),

  resetObserver: observer('promiseState', 'reset', function() {
    let states = ['resolved', 'rejected', 'fulfilled'];
    let found = false;
    let promiseState = get(this, 'promiseState');

    for (let idx = 0; idx < states.length && !found; idx++) {
      found = (promiseState === states[idx]);
    }

    if (get(this, 'reset') && found) {
      set(this, 'promiseState', 'default');
    }
  }),

  handleActionPromise: observer('promise', function() {
    let promise = get(this, 'promise');

    if (!promise) {
      return;
    }

    promise.then(() => {
      if (!this.isDestroyed) {
        set(this, 'promiseState', 'fulfilled');
      }
    }).catch(() => {
      if (!this.isDestroyed) {
        set(this, 'promiseState', 'rejected');
      }
    });
  }),

  setUnknownProperty(key, value) {
    if (key === 'resolved') {
      deprecate(`The 'resolved' property is deprecated. Please use 'fulfilled'`, false);
      key = 'fulfilled';
    }

    this[key] = null;
    this.set(key, value);
  },

  _href: computed('href', function() {
    let href = get(this, 'href');
    if (href) {
      return href;
    }

    let tagName = get(this, 'tagName').toLowerCase();
    if (tagName === 'a' && href === undefined) {
      return '';
    }
  })
});

// Ember 1.13.6 will deprecate specifying `positionalParams` on the
// instance in favor of class level property
//
// Having both defined keeps us compatible with Ember 1.13+ (all patch versions)
ButtonComponent.reopenClass(positionalParamsMixin);

export default ButtonComponent;
