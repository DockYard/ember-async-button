import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({
  dynamicArgument: 'argument 3',

  actions: {
    save(callback, passedArgument1, passedArgument2, passedArgument3) {
      const _this = this;
      const promise = new Ember.RSVP.Promise(function(resolve, reject) {
        if (_this.get('rejectPromise')) {
          Ember.run.later(function() {
            reject();
          }, _this.get('timeoutLength'));
        } else {
          Ember.run.later(function() {
            _this.set('actionArgument1', passedArgument1);
            _this.set('actionArgument2', passedArgument2);
            _this.set('actionArgument3', passedArgument3);
            resolve();
          }, _this.get('timeoutLength'));
        }
      });
      callback(promise);
    }
  }
});
