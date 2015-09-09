import Ember from "ember";

var Foo = Ember.Object.extend({
  name: '',
  isNotDirty: Ember.computed.not('isDirty'),
  isDirty: Ember.computed('name', function() {
      return this.get('name').length > 0;
  })
});

export default Ember.Route.extend({
  model: function() {
    return Foo.create();
  }
});
