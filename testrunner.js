var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var util = require('util');
require('events').EventEmitter.prototype._maxListeners = 0;

jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.configureDefaultReporter({
  showColors: true,
  watch: true,
  stopSpecOnExpectationFailure: false,
  random: true,
  autotest: true,
  verbose:true,
  print: function () {
    process.stdout.write(util.format.apply(this, arguments));
  }
});
jasmine.execute();
jasmine.onComplete(function (passed) {
  if (passed) {
    console.log('All specs have passed');
  } else {
    console.log('At least one/some spec has failed');
  }
});
