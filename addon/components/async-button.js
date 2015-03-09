import Ember from 'ember';
import layout from '../templates/components/async-button';

var get = Ember.get;
var getWithDefault = Ember.getWithDefault;
var set = Ember.set;

export default Ember.Component.extend({
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
    var rawActionArguments = this.getWithDefault('_actionArgs', []);
    var actionArgumentTypes = this.getWithDefault('_argTypes', []);

    function callbackHandler(promise) {
      set(_this, 'promise', promise);
    }

    var actionArguments = ['action', callbackHandler];

    // Some of the arguments passed in might be bound values (ID type according to
    // the option types stored in _argTypes). If so, we get the stream and retrieve
    // the value when the button is clicked. Once the Stream API is public,
    // the helper will be converted to pass in a concatenated array of streams
    for (var index = 0, length = rawActionArguments.length; index < length; index++) {
      var value = rawActionArguments[index];

      if (actionArgumentTypes[index] === 'ID') {
        value = this._parentView.getStream(value).value();
      }

      actionArguments.push(value);
    }


    this.sendAction.apply(this, actionArguments);
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
    get(this, 'promise').then(function() {
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
