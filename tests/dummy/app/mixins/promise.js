import Ember from 'ember';

const {
  get,
  set,
  run: { later },
  RSVP: { Promise }
} = Ember;

export default Ember.Mixin.create({
  actions: {
    save(callback, passedArgument1, passedArgument2, passedArgument3) {
      let promise = new Promise((resolve, reject) => {
        if (get(this, 'rejectPromise')) {
          later(() => {
            reject();
          }, get(this, 'timeoutLength'));
        } else {
          later(() => {
            set(this, 'actionArgument1', passedArgument1);
            set(this, 'actionArgument2', passedArgument2);
            set(this, 'actionArgument3', passedArgument3);
            resolve();
          }, get(this, 'timeoutLength'));
        }
      });
      callback(promise);
    }
  }
});
