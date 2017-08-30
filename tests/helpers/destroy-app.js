import { run } from '@ember/runloop';
import { assertionCleanup } from '../assertions';

export default function destroyApp(application) {
  run(application, 'destroy');
  assertionCleanup(application);
}
