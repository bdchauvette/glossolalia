const test = require('tape');
const glossolalia = require('../src');

test('6 to 5', (t) => {
  t.plan(2);

  const code = 'const foo = "bar";';
  const transformedCode = glossolalia.transform(code, { iterations: 1 });

  t.ok(
    /"use strict";/.test(transformedCode),
    'uses strict mode'
  );

  t.ok(
    /var/.test(transformedCode),
    'uses `var` instead of `const`'
  );
});

test('6 to 5 (many iterations)', (t) => {
  t.plan(2);

  const code = 'const foo = "bar";';
  const transformedCode = glossolalia.transform(code, { iterations: 111 });

  t.ok(
    /"use strict";/.test(transformedCode),
    'uses strict mode'
  );

  t.ok(
    /var/.test(transformedCode),
    'uses `var` instead of `const`'
  );
});

test('5 to 6', (t) => {
  t.plan(1);

  const code = 'var foo = "bar";';
  const transformedCode = glossolalia.transform(code, {
    initialSpec: 'es5',
    iterations: 1,
  });

  t.ok(
    /const/.test(transformedCode),
    'uses `const` instead of `var`'
  );
});

test('5 to 6 (many iterations)', (t) => {
  t.plan(1);

  const code = 'var foo = "bar";';
  const transformedCode = glossolalia.transform(code, {
    initialSpec: 'es5',
    iterations: 1,
  });

  t.ok(
    /const/.test(transformedCode),
    'uses `const` instead of `var`'
  );
});

test('6 to 5 to 6', (t) => {
  t.plan(2);

  const code = `
    class Foo {
      constructor(bar) {
        this.bar = bar;
      }
    }
  `;

  const transformedCode = glossolalia.transform(code);

  t.ok(
    /classCallCheck/.test(transformedCode),
    'preserves `classCallCheck`'
  );

  t.ok(
    /const/.test(transformedCode),
    'uses `const` instead of `var`'
  );
});

test('5 to 6 to 5', (t) => {
  t.plan(3);


  const code = `
    function Foo() {};
    Foo.prototype.bar = function() {};
  `;

  const transformedCode = glossolalia.transform(code, {
    initialSpec: 'es5',
  });

  t.ok(
    /"use strict";/.test(transformedCode),
    'preserves `strict` mode'
  );

  t.ok(
    /classCallCheck/.test(transformedCode),
    'preserves `classCallCheck`'
  );

  t.ok(
    /\bvar\b/.test(transformedCode),
    'uses `bar` instead of `const`'
  );
});
