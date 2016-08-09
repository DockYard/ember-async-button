import Ember from 'ember';

const {
  Object: EmberObject,
  Route,
  computed,
  computed: { not }
} = Ember;

let Foo = EmberObject.extend({
  name: '',
  isNotDirty: not('isDirty'),
  isDirty: computed('name', function() {
    return this.get('name').length > 0;
  })
});

export default Route.extend({
  model() {
    return Foo.create();
  }
});
