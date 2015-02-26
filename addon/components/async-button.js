import Ember from 'ember';
import layout from '../templates/components/async-button';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'button',
  textState: 'default',
  reset: false,
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled', 'type'],

  type: 'submit',
  disabled: Ember.computed.equal('textState','pending'),

  click: function() {
    var _this = this;
    this.sendAction('action', function(promise){
      _this.set('promise', promise);
    });
    this.set('textState', 'pending');

    // If this is part of a form, it will perform an HTML form
    // submission
    return false;
  },

  text: Ember.computed('textState', 'default', 'pending', 'resolved', 'fulfilled', 'rejected', function() {
    return this.getWithDefault(this.textState, this.get('default'));
  }),

  resetObserver: Ember.observer('textState', 'reset', function(){
    if(this.get('reset') && ['resolved', 'rejected', 'fulfilled'].contains(this.get('textState'))){
      this.set('textState', 'default');
    }
  }),

  handleActionPromise: Ember.observer('promise', function() {
    var _this = this;
    this.get('promise').then(function() {
      if (!_this.isDestroyed) {
        _this.set('textState', 'fulfilled');
      }
    }).catch(function() {
      if (!_this.isDestroyed) {
        _this.set('textState', 'rejected');
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
  }
});
