import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function(callback) {
      var _this = this;
      var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        if (_this.get('rejectPromise')) {
          Ember.run.later(function() {
            reject();
          }, _this.get('timeoutLength'));
        } else {
          Ember.run.later(function() {
            resolve();
          }, _this.get('timeoutLength'));
        }
      });
      callback(promise);
    }
  }
});
