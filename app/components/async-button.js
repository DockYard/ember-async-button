import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  textState: 'default',
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled'],

  disabled: Ember.computed('textState', function() {
    return this.get('textState') === 'pending';
  }),

  click: function() {
    this.sendAction();
    this.set('textState', 'pending');
  },

  text: Ember.computed('textState', function() {
    return this.getWithDefault(this.textState, this.get('default'));
  }),

  bindActionPromise: Ember.on('init', function() {
    var promisePath = '_parentView.context.' + this.get('action') + 'Promise';
    this.set('actionPromiseBinding', Ember.bind(this, 'actionPromise', promisePath));
  }),

  handleActionPromise: Ember.observer('actionPromise', function() {
    var _this = this;
    this.get('actionPromise').then(function() {
      _this.set('textState', 'success');
    }).catch(function() {
      _this.set('textState', 'fail');
    });
  }),
});
