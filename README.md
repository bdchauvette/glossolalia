# glossolalia
**_or: There and Back Again_**

`glossolalia` is a JavaScript transpiler that repeatedly transpiles code back
and forth between ES5 and ES6.

Ever wonder what your `babel` output would look like as ES6? Wonder no more!

**Shoutout to [/u/toqy](https://www.reddit.com/r/javascript/comments/4jyphe/lebab_modernizes_your_code_it_does_the_opposite/d3axh5t) for the idea!**

---

## Installation

```sh
# For API usage
npm i -S glossolalia
```

```sh
# For CLI usage
npm i -g glossolalia
```

---

## CLI

```sh
# Example:
glossolalia --output transformed.js original.js
```

```sh
# For more info:
glossolalia --help
```

---

## API

### `glossolalia.transform(code, [options]): string`
```js
glossolalia.transform(
  code: string,
  options: ?Object = {
    initialSpec: 'es6',
    iterations: 2,
    babel: { presets: ['es2015'] },
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
  }
);
```

---
