import QUnit from 'qunit';

export default function(actual, expected, message) {
  let text;
  if (actual.text) {
    text = actual.text();
  } else {
    text = actual;
  }

  const result = text.indexOf(expected) > -1;

  QUnit.push(result, text, expected, message || 'contains');
}
