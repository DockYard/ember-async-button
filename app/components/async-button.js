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
    return this.get(this.textState);
  }),

  bindActionPromise: Ember.on('init', function() {
    var promisePath = '_parentView.context.' + this.get('action') + 'Promise';
    this.set('actionPromiseBinding', Ember.bind(this, 'actionPromise', promisePath));
  }),

  handleActionPromise: Ember.observer('actionPromise', function() {
    var _this = this;
    this.get('actionPromise').then(function() {
      if (_this.get('success')) {
        _this.set('textState', 'success');
      } else {
        _this.set('textState', 'default');
      }
    }).catch(function() {
      if (_this.get('fail')) {
        _this.set('textState', 'fail');
      } else {
        _this.set('textState', 'default');
      }
    });
  }),
});
