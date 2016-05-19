Object.defineProperty(exports, "__esModule", {
  value: true
});

import _babelCore from 'babel-core';

const _babelCore2 = _interopRequireDefault(_babelCore);

import _lebab from 'lebab';
import _merge from 'merge';

const _merge2 = _interopRequireDefault(_merge);

import _memoizee from 'memoizee';

const _memoizee2 = _interopRequireDefault(_memoizee);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

const VALID_SPECS = {
  ES5: ['es5'],
  ES6: ['es6', 'es2015', 'esnext']
};

const DEFAULTS = {
  initialSpec: 'es6',
  iterations: 2,
  babel: {
    presets: ['es2015']
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
    'commonjs': true
  }
};

export var default = {
  transform: function transform(code, userOptions) {
    const options = userOptions ? _merge2.default.recursive({}, DEFAULTS, userOptions) : (0, _merge2.default)({}, DEFAULTS);

    // Transipiling large files can be slow, so we memoize the transformers to
    // handle cases where we have a large number of iterations but the
    // transformations have reached an equilibrium of sorts, and just bounce
    // between the same two steps.
    //
    // Alternatively, we could do our own detection for repeated outputs, but
    // this is much simpler.
    const babelTransform = (0, _memoizee2.default)(_babelCore2.default.transform);

    const lebab = new _lebab.Transformer(options.lebab);
    const lebabTransform = (0, _memoizee2.default)(lebab.run.bind(lebab));

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

  validSpecs: [].concat(_toConsumableArray(VALID_SPECS.ES5), _toConsumableArray(VALID_SPECS.ES6))
};

// =============================================================================

function isESNext(spec) {
  return VALID_SPECS.ES6.includes(spec.toLowerCase());
}

function isES5(spec) {
  return spec.toLowerCase() === 'es5';
}

function getNextSpec(currentSpec) {
  return isES5(currentSpec) ? 'es6' : 'es5';
}