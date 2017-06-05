import Ember from 'ember';
import { assertionCleanup } from '../assertions';

const { run } = Ember;

export default function destroyApp(application) {
  run(application, 'destroy');
  assertionCleanup(application);
}
