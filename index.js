/* jshint node: true */
'use strict';

var checker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-cli-async-button',

  init: function() {
    checker.assertAbove(this, '0.2.0');
  }
};
