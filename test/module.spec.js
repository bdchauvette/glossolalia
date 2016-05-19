const test = require('tape');
const glossolalia = require('../src');

test('Exported module', (t) => {
  t.plan(4);

  t.ok(
    glossolalia.hasOwnProperty('transform'),
    'exported module has a `transform` property'
  );

  t.equal(
    typeof glossolalia.transform,
    'function',
    'exported `transform` property is a function'
  );

  t.ok(
    glossolalia.hasOwnProperty('validSpecs'),
    'exported module has a `validSpecs` property'
  );

  t.deepEqual(
    glossolalia.validSpecs,
    ['es5', 'es6', 'es2015', 'esnext'],
    'exported `validSpecs` property has expected values'
  );
});
