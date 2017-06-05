export default function(context, element, text, message) {
  message = message || `${element} should contain "${text}"`;
  let actual = context.$(element).text();
  let expected = text;
  let result = !!actual.match(new RegExp(expected));

  this.pushResult({ result, actual, expected, message });
}
