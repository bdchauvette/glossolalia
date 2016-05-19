const babel = require('babel-core');
const Lebab = require('lebab').Transformer;
const merge = require('merge');
const memoize = require('memoizee');

const VALID_SPECS = {
  ES5: ['es5'],
  ES6: ['es6', 'es2015', 'esnext'],
};

const DEFAULTS = {
  initialSpec: 'es6',
  iterations: 2,
  babel: {
    presets: ['es2015'],
  },
  lebab: {
    'class': true,
    'template': true,
    'arrow': true,
    'let': true,
    'default-param': true,
    'arg-spread': true,
    'obj-method': true,
    'obj-shorthand': true,
    'no-strict': true,
    'commonjs': true,
  },
};

module.exports = {
  transform(code, userOptions) {
    const options = (userOptions)
      ? merge.recursive({}, DEFAULTS, userOptions)
      : merge({}, DEFAULTS);

    // Transipiling large files can be slow, so we memoize the transformers to
    // handle cases where we have a large number of iterations but the
    // transformations have reached an equilibrium of sorts, and just bounce
    // between the same two steps.
    //
    // Alternatively, we could do our own detection for repeated outputs, but
    // this is much simpler.
    const babelTransform = memoize(babel.transform);

    const lebab = new Lebab(options.lebab);
    const lebabTransform = memoize(lebab.run.bind(lebab));

    let currSpec = options.initialSpec;
    let transformedCode = code;

    for (let i = 0; i < options.iterations; i++) {
      if (isESNext(currSpec)) {
        transformedCode = babelTransform(transformedCode, options.babel).code;
      } else if (isES5(currSpec)) {
        transformedCode = lebabTransform(transformedCode);
      } else {
        throw new Error(`Unknown spec: ${currSpec}`);
      }

      currSpec = getNextSpec(currSpec);
    }

    return transformedCode;
  },

  validSpecs: [...VALID_SPECS.ES5, ...VALID_SPECS.ES6],
};

// =============================================================================

function isESNext(spec) {
  return VALID_SPECS.ES6.includes(spec.toLowerCase());
}

function isES5(spec) {
  return (spec.toLowerCase() === 'es5');
}

function getNextSpec(currentSpec) {
  return (isES5(currentSpec))
    ? 'es6'
    : 'es5';
}
