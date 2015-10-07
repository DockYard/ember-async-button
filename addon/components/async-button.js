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

var positionalParams = {
  positionalParams: 'params'
};

var ButtonComponent = Component.extend(positionalParams, {
  layout: layout,
  tagName: 'button',
  textState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled', 'type', '_href:href', 'tabindex'],

  type: 'submit',
  disabled: computed('textState','disableWhen', function() {
      var textState = get(this, 'textState');
      var disableWhen = get(this, 'disableWhen');
      return disableWhen || textState === 'pending';
  }),

  click: function() {
    var params = getWithDefault(this, 'params', []);

    const callbackHandler = (promise) => {
      set(this, 'promise', promise);
    };

    var actionArguments = ['action', callbackHandler, ...params];

    this.sendAction(...actionArguments);
    set(this, 'textState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission without returning false to prevent action bubbling
    return false;
  },

  text: computed('textState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return getWithDefault(this, this.textState, get(this, 'default'));
  }),

  resetObserver: observer('textState', 'reset', function(){
    var states = ['resolved', 'rejected', 'fulfilled'];
    var found = false;
    var textState = get(this, 'textState');

    for (var idx = 0; idx < states.length && !found; idx++) {
      found = (textState === states[idx]);
    }

    if(get(this, 'reset') && found){
      set(this, 'textState', 'default');
    }
  }),

  handleActionPromise: observer('promise', function() {
    var promise = get(this, 'promise');
    if(!promise) { return; }
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

  setUnknownProperty: function(key, value) {
    if (key === 'resolved') {
      deprecate("The 'resolved' property is deprecated. Please use 'fulfilled'", false);
      key = 'fulfilled';
    }

    this[key] = null;
    this.set(key, value);
  },

  _href: computed('href', function() {
    var href = get(this, 'href');
    if (href) { return href; }

    var tagName = get(this, 'tagName').toLowerCase();
    if (tagName === 'a' && href === undefined) { return ''; }
  })
});

// Ember 1.13.6 will deprecate specifying `positionalParams` on the
// instance in favor of class level property
//
// Having both defined keeps us compatible with Ember 1.13+ (all patch versions)
ButtonComponent.reopenClass(positionalParams);

export default ButtonComponent;
