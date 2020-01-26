// snipsnap library collection
const snipsnapLibsCollection = require('./test-dependency-list');
const { pipe, forEach } = require('./helpers/common');
const {
  getAllLibrarySnippets,
  writeSnippetFile,
  composeSnippets,
  namespaceSnippets,
} = require('./helpers/local');

// helpers
const writeOutput = forEach(writeSnippetFile);

const main = () =>
  getAllLibrarySnippets(snipsnapLibsCollection).then(
    pipe(namespaceSnippets, composeSnippets, writeOutput)
  );

// initiate snippets processing
main();
