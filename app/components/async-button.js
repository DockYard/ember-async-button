import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  textState: 'default',
  classNames: ['async-button'],
  classNameBindings: ['textState'],
  attributeBindings: ['disabled'],

  disabled: Ember.computed.equal('textState','pending'),

  click: function() {
    this.sendAction();
    this.set('textState', 'pending');
  },

  text: Ember.computed('textState', 'default', 'pending', 'resolved', 'rejected', function() {
    return this.getWithDefault(this.textState, this.get('default'));
  }),

  bindActionPromise: Ember.on('init', function() {
    var promisePath = '_parentView.context.' + this.get('action') + 'Promise';
    this.set('actionPromiseBinding', Ember.bind(this, 'actionPromise', promisePath));
  }),

  handleActionPromise: Ember.observer('actionPromise', function() {
    var _this = this;
    this.get('actionPromise').then(function() {
      _this.set('textState', 'resolved');
    }).catch(function() {
      _this.set('textState', 'rejected');
    });
  }),
});
