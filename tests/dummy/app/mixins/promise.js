import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';

export default Mixin.create({
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
