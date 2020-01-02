// snipsnap library collection
const snipsnapLibsCollection = require('./test-dependency-list');
const { pipe } = require('./helpers/common');
const {
  getAllLibrarySnippets,
  writeFile,
  composeSnippets,
  namespaceSnippets,
  trace,
} = require('./helpers/local');

// helpers
const writeOutput = writeFile(`${__dirname}/output.json`);

const main = () =>
  getAllLibrarySnippets(snipsnapLibsCollection).then(
    pipe(trace('Before all'), namespaceSnippets, composeSnippets, writeOutput)
  );

// initiate snippets processing
main();
