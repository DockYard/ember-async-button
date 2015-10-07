import Ember from 'ember';

let Foo = Ember.Object.extend({
  name: '',
  isNotDirty: Ember.computed.not('isDirty'),
  isDirty: Ember.computed('name', function() {
    return this.get('name').length > 0;
  })
});

export default Ember.Route.extend({
  model() {
    return Foo.create();
  }
});
