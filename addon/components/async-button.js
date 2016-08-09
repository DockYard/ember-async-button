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
  textState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled', 'type', '_href:href', 'tabindex'],

  type: 'submit',
  disabled: computed('textState', 'disableWhen', function() {
    let textState = get(this, 'textState');
    let disableWhen = get(this, 'disableWhen');
    return disableWhen || textState === 'pending';
  }),

  click() {
    let params = getWithDefault(this, 'params', []);
    let callbackHandler = (promise) => {
      set(this, 'promise', promise);
    };

    if (typeof this.attrs.action === 'function') {
      let deprecatingCallbackHandler = function(promise) {
        deprecate(`When using closure style actions with ember-async-button,
please return the promise instead of using the callback argument.
The callback for closure actions will be removed in future versions.`,
          false,
          { id: 'ember-async-button.action-callback', until: '0.8.0' });

        callbackHandler(promise);
      };

      let promise = this.attrs.action(deprecatingCallbackHandler, ...params);

      if (promise && typeof promise.then === 'function') {
        callbackHandler(promise);
      }
    } else {
      let actionArguments = ['action', callbackHandler, ...params];

      this.sendAction(...actionArguments);
    }

    set(this, 'textState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission without returning false to prevent action bubbling
    return false;
  },

  text: computed('textState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return getWithDefault(this, this.textState, get(this, 'default'));
  }),

  resetObserver: observer('textState', 'reset', function() {
    let states = ['resolved', 'rejected', 'fulfilled'];
    let found = false;
    let textState = get(this, 'textState');

    for (let idx = 0; idx < states.length && !found; idx++) {
      found = (textState === states[idx]);
    }

    if (get(this, 'reset') && found) {
      set(this, 'textState', 'default');
    }
  }),

  handleActionPromise: observer('promise', function() {
    let promise = get(this, 'promise');

    if (!promise) {
      return;
    }

    promise.then(() => {
      if (!this.isDestroyed) {
        set(this, 'textState', 'fulfilled');
      }
    }).catch(() => {
      if (!this.isDestroyed) {
        set(this, 'textState', 'rejected');
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
