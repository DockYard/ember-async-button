import Ember from 'ember';
import layout from '../templates/components/async-button';

var get = Ember.get;
var getWithDefault = Ember.getWithDefault;
var set = Ember.set;

export default Ember.Component.extend({
  positionalParams: 'params',
  layout: layout,
  tagName: 'button',
  textState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled', 'type', '_href:href'],

  type: 'submit',
  disabled: Ember.computed.equal('textState','pending'),

  click: function() {
    var _this = this;
    var params = this.getWithDefault('params', []);

    function callbackHandler(promise) {
      set(_this, 'promise', promise);
    }

    var actionArguments = ['action', callbackHandler, ...params];

    this.sendAction(...actionArguments);
    set(this, 'textState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission without returning false to prevent action bubbling
    return false;
  },

  text: Ember.computed('textState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return getWithDefault(this, this.textState, get(this, 'default'));
  }),

  resetObserver: Ember.observer('textState', 'reset', function(){
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

  handleActionPromise: Ember.observer('promise', function() {
    var _this = this;
    var promise = get(this, 'promise');
    if(!promise) { return; }
    promise.then(function() {
      if (!_this.isDestroyed) {
        set(_this, 'textState', 'fulfilled');
      }
    }).catch(function() {
      if (!_this.isDestroyed) {
        set(_this, 'textState', 'rejected');
      }
    });
  }),

  setUnknownProperty: function(key, value) {
    if (key === 'resolved') {
      Ember.deprecate("The 'resolved' property is deprecated. Please use 'fulfilled'", false);
      key = 'fulfilled';
    }

    this[key] = null;
    this.set(key, value);
  },

  _href: Ember.computed('href', function() {
    var href = get(this, 'href');
    if (href) { return href; }

    var tagName = get(this, 'tagName').toLowerCase();
    if (tagName === 'a' && href === undefined) { return ''; }
  })
});
