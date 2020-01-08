// snipsnap library collection
const snipsnapLibsCollection = require('./test-dependency-list');
const { pipe } = require('./helpers/common');
const {
  getAllLibrarySnippets,
  writeFile,
  composeSnippets,
  namespaceSnippets,
} = require('./helpers/local');

// helpers
const writeOutput = writeFile(`${__dirname}/output.json`);

const main = () =>
  getAllLibrarySnippets(snipsnapLibsCollection).then(
    pipe(namespaceSnippets, composeSnippets, writeOutput)
  );

// initiate snippets processing
main();
