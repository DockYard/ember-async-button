import Ember from 'ember';
import PromiseMixin from "dummy/mixins/promise";

export default Ember.Controller.extend(PromiseMixin, {
  dynamicArgument: "argument 3",
});
