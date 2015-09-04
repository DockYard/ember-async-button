import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  Resolver,
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix
});

loadInitializers(App, config.modulePrefix);

export default App;
