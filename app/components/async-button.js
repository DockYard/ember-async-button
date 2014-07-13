import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  textState: 'default',
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled'],

  disabled: Ember.computed.equal('textState','pending'),

  click: function() {
    var _this = this;
    this.sendAction('action', function(promise){
      _this.set('promise', promise);
    });
    this.set('textState', 'pending');

    // If this is part of a form, it will preform an HTML form
    // submission
    return false;
  },

  text: Ember.computed('textState', 'default', 'pending', 'resolved', 'rejected', function() {
    return this.getWithDefault(this.textState, this.get('default'));
  }),

  handleActionPromise: Ember.observer('promise', function() {
    var _this = this;
    this.get('promise').then(function() {
      _this.set('textState', 'resolved');
    }).catch(function() {
      _this.set('textState', 'rejected');
    });
  })
});
