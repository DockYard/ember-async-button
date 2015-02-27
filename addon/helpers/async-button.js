import Ember from 'ember';
import AsyncButtonComponent from '../components/async-button';

// We are not creating an HTMLBars helper that this point, as Streams are still a private API
// Once Streams are locked down and converted to a public API, we can convert this to an
// HTMLBars helper and use Stream's concat function to convert the argument streams into
// a new stream that is passed to the component
export default function() {
  var args = [].slice.apply(arguments);
  var options = args.pop();
  var hash = options.hash;
  var hashKeys = Ember.keys(hash);

  // Passing in the bare arguements passed to the helper, and some of those my be bindings
  // We pass in the argument types so that we can use Handlebars.get to retrieve the values
  // from the current parent view if the argument is a bound value
  hash._actionArgs = args;
  hash._argTypes = options.types;

  // The hash arguments passed in may be bindings to dynamic values.
  // If the hash key is already `<attribute>Binding`, we ignore it, as the component
  // will handle the attribute binding. If the hash argument is an ID type (aka a binding)
  // we change it's key to `<attribute>Binding`, so that the component handles the binding
  // automatically. We have to do this as we are creating our own helper instead of
  // depending on Ember's generated helper.
  for (var i = 0, l = hashKeys.length; i < l; i++) {
    var key = hashKeys[i];

    if(/Binding$/.test(key)) {
      continue;
    }

    if (options.hashTypes[key] === 'ID') {
      hash[key + 'Binding'] = hash[key];
      delete hash[key];
    }
  }
  return Ember.Handlebars.helpers.view.helperFunction.call(this, [AsyncButtonComponent], hash, options, options);
}
