import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('async-button', 'AsyncButtonComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  unit: true
});

// Default test
test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('tag name should be configurable', function(assert) {
  assert.expect(1);
  var component = this.subject({
    tagName: 'a'
  });
  this.render();
  var $component = this.$();
  var tagName = $component.prop('tagName').toLowerCase();
  assert.equal(tagName, 'a');
});

test('non-a tag should not have a href attr by default', function(assert) {
  assert.expect(1);
  var component = this.subject();
  this.render();
  var $component = this.$();
  var href = $component.attr('href');
  assert.equal(href, undefined);
});

test(
  "should have a href attr if it's explicitly defined. " +
  "Assuming the user needs it for some reason.",
  function(assert) {
    assert.expect(1);
    var component = this.subject({
      href: 'lol'
    });
    this.render();
    var $component = this.$();
    var href = $component.attr('href');
    assert.equal(href, 'lol');
  }
);

test('a tag should have an empty href attr by default', function(assert) {
  assert.expect(1);
  var component = this.subject({
    tagName: 'a'
  });
  this.render();
  var $component = this.$();
  var href = $component.attr('href');
  assert.equal(href, '');
});

test('a tag: href attr should be configurable', function(assert) {
  assert.expect(1);
  var component = this.subject({
    tagName: 'a',
    href: 'zomg'
  });
  this.render();
  var $component = this.$();
  var href = $component.attr('href');
  assert.equal(href, 'zomg');
});


test('a tag: user should be able to opt out of href attr', function(assert) {
  assert.expect(1);
  var component = this.subject({
    tagName: 'a',
    href: false
  });
  this.render();
  var $component = this.$();
  var href = $component.attr('href');
  assert.equal(href, undefined);
});


