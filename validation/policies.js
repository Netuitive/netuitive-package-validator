var fs = require('fs');
var jsonValidator = require('json-dup-key-validator');

var ErrorTracker = require('../util/errorTracker');

var indent = '    ';

var Logger = require('../util/logger');
var logger = new Logger(indent);

module.exports = {
  validate
};

function validate(policyList, location, policy) {
  var errorTracker = new ErrorTracker(policy, indent);

  try {
    var json = fs.readFileSync(location + policy, 'utf8');
    var jsonParseError = jsonValidator.validate(json, false);

    errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

    var pol = JSON.parse(json);

    errorTracker.assertTrue(true, 'Policy is valid JSON');

    errorTracker.assertTrue((pol.policy.scope.elementType && typeof pol.policy.scope.elementType === 'string') || (pol.policy.scope.elementTypes && Array.isArray(pol.policy.scope.elementTypes)), 'Policy has a valid elementType(s)');

    errorTracker.assertTrue(policyList.filter(policyItem => policyItem.data.file === 'policies/' + policy).length === 1, 'Policy found in package.json list');
  } catch(err) {
    errorTracker.log('Error: ' + err);
  }
  return errorTracker.getErrors();
}
