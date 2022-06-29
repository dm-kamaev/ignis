'use strict';

module.exports = () => {
  console.log('start');
  return setInterval(() => {
    console.log(1111);
  }, 10000);
};