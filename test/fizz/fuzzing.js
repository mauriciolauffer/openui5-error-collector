'use strict';

const horde = gremlins.createHorde();
console.dir([...ui5ErrorCollector.getErrors()]);
console.profile('gremlins');
horde.unleash().then(() => {
  console.profileEnd();
  console.dir([...ui5ErrorCollector.getErrors()]);
});
