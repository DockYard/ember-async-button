import Ember from 'ember';
import layout from '../templates/components/async-button';

const {
  Component,
  computed,
  computed: { equal },
  deprecate,
  get,
  getWithDefault,
  observer,
  set
} = Ember;

const positionalParams = {
  positionalParams: 'params'
};

const ButtonComponent = Component.extend(positionalParams, {
  layout,
  tagName: 'button',
  textState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled', 'type', '_href:href'],

  type: 'submit',
  disabled: equal('textState', 'pending'),

  click() {
    const params = this.getWithDefault('params', []);

    const callbackHandler = ((promise) => {
      set(this, 'promise', promise);
    });

    const actionArguments = ['action', callbackHandler, ...params];

    this.sendAction(...actionArguments);
    set(this, 'textState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission without returning false to prevent action bubbling
    return false;
  },

  text: computed('textState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return getWithDefault(this, this.textState, get(this, 'default'));
  }),

  resetObserver: observer('textState', 'reset', function() {
    let found = false;
    const states = ['resolved', 'rejected', 'fulfilled'];
    const textState = get(this, 'textState');

    for (let idx = 0; idx < states.length && !found; idx++) {
      found = (textState === states[idx]);
    }

    if (get(this, 'reset') && found) {
      set(this, 'textState', 'default');
    }
  }),

  handleActionPromise: observer('promise', function() {
    const promise = get(this, 'promise');
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
      deprecate("The 'resolved' property is deprecated. Please use 'fulfilled'", false);
      key = 'fulfilled';
    }

    this[key] = null;
    this.set(key, value);
  },

  _href: computed('href', function() {
    const href = get(this, 'href');
    if (href) {
      return href;
    }

    const tagName = get(this, 'tagName').toLowerCase();
    if (tagName === 'a' && href === undefined) {
      return '';
    }
  })
});

// Ember 1.13.6 will deprecate specifying `positionalParams` on the
// instance in favor of class level property
//
// Having both defined keeps us compatible with Ember 1.13+ (all patch versions)
ButtonComponent.reopenClass(positionalParams);

export default ButtonComponent;
