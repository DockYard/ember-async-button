import Route from '@ember/routing/route';
import EmberObject, { computed } from '@ember/object';
import { not } from '@ember/object/computed';

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
