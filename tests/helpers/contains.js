import QUnit from 'qunit';

export default function(actual, expected, message) {
  var text;
  if (actual.text) {
    text = actual.text();
  } else {
    text = actual;
  }

  var result = text.indexOf(expected) > -1;

  QUnit.push(result, text, expected, message || 'contains');
}
