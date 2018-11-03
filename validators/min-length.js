const chalk = require('chalk');

module.exports = function validateMinLengthFactory(length) {
  return (value) => (value.length < length)
    ? `${ chalk.red('Incorrect value: ') } value to short`
    : true;
};
