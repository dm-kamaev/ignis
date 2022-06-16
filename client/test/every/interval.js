'use strict';

module.exports = () => {
  console.log(111, setInterval.toString());
  return setInterval(() => {
    console.log('CALL INTERVAL');
  }, 1000);
};