#!/usr/bin/env node

/* eslint-disable no-console */

const Promise = require('bluebird');
const path = require('path');
const pkg = require('../package.json');
const cli = require('commander');
const fs = require('mz/fs');
const getStdin = require('get-stdin');
const jsonfile = require('jsonfile');
const makeSentence = require('array-to-sentence');

const glossolalia = require('../src');


cli
  .version(pkg.version)
  .arguments('<input>')
  .option('-s, --initial-spec <version>', 'Specify which version of JS to start with')
  .option('-i, --iterations <#>', 'Number of iterations')
  .option('-o, --output <file>', 'Output file')
  .option('-B, --babelrc <file>', 'Babel configuration file')
  .option('-L, --lebabrc <file>', 'Lebab configuration file')
  .parse(process.argv);

const userOptions = getOptions(cli);

Promise.resolve(cli.args)
  .then((args) => {
    if (args.length) {
      const files = args.map((file) => fs.readFile(path.resolve(file), 'utf8'));
      return Promise.all(files);
    }

    return getStdin();
  })
  .then((input) => {
    const originalCode = (Array.isArray(input))
      ? input
      : [input];

    return originalCode.map((code) => glossolalia.transform(code, userOptions));
  })
  .then((transformedCode) => {
    if (cli.output) {
      const outputFile = path.resolve(cli.output);
      fs.unlink(outputFile)
        .catch(() => null)
        .then(() => {
          Promise.each(transformedCode, (code) => fs.appendFile(outputFile, code, 'utf8'));
        });
    } else {
      transformedCode.forEach((code) => process.stdout.write(code));
    }
  })
  .catch((err) => {
    die(err);
  });

// =============================================================================

function die(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function getOptions(input) {
  const options = {};

  if (input.initialSpec) {
    const validSpecs = glossolalia.validSpecs;
    const normalizedSpec = input.initialSpec.toLowerCase();

    if (!validSpecs.includes(normalizedSpec)) {
      const validSpecSentence = makeSentence(validSpecs, { lastSeparator: ', or ' });
      die(
        `${input.initialSpec}' is not a valid spec. `
        + `Must be one of: ${validSpecSentence}.`
      );
    }

    options.initialSpec = normalizedSpec;
  }

  if (input.iterations) {
    options.iterations = +input.iterations;
  }

  if (input.babelrc) {
    const babelrc = jsonfile.readFileSync(path.resolve(input.babelrc));
    options.babel = babelrc;
  }

  if (input.lebabrc) {
    const lebabrc = jsonfile.readFileSync(path.resolve(input.lebabrc));
    options.lebab = lebabrc;
  }

  return options;
}
