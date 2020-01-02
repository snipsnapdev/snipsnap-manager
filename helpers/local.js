const https = require('https');
const fsPromises = require('fs').promises;
const { curry, map } = require('./common');

// trace value at any moment in fn composition chain
// trace(tag: String = 'Tracing:') -> (data: Any) -> Any
const trace = curry((tag = 'Tracing:') => (data) => {
  console.log(
    `\n${tag}:${typeof data === 'object' ? JSON.stringify(data) : data}\n`
  );
  return data;
});

// flattens 2d snippet array into array of objects
// composeSnippets({name: String, snippets: [Array]}) -> Array
const composeSnippets = map(({ name, snippets }) => ({
  name,
  snippets: snippets.map(([key, val]) => ({ [key]: { ...val } })),
}));

// transforms foreign library naming format into snipsnap's
// namespaceSnippets({name: String, snippets: Arrary}) -> Array
const namespaceSnippets = map(({ name, snippets }) => ({
  name,
  snippets: Object.entries(snippets).map(([key, val], i) => [
    `${name}_${i}_${key}`,
    {
      ...val,
      // adjusting prefix
      prefix: [name].concat(
        Array.isArray(val.prefix) ? val.prefix : [val.prefix]
      ),
    },
  ]),
}));

// standart node https request wrapped in a promise
// getLibrarySnippets(lib: String, url: String ) -> Promise
const getLibrarySnippets = (libName, url) =>
  new Promise((resolve, reject) =>
    https
      .get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => 
          resolve({
            name: libName,
            snippets: JSON.parse(data),
          });
        );
      })
      .on('error', (err) => reject(`Error: ${err.message}`))
  );

// same as above but handles batch requests
// getAllLibrarySnippets(processEntryFn: Function) -> (libraries: Array) -> Promise
const getAllLibrarySnippets = ((processEntryFn) => (libraries) =>
  Promise.all(
    libraries.map(({ name, snippetsLink }) =>
      processEntryFn(name, snippetsLink)
    )
  ))(getLibrarySnippets);

// writes data to a file using node fs module w/ promise
// writeFile(path: String) -> (data: Any) -> Promise
const writeFile = (path) => (data) =>
  fsPromises.writeFile(path, JSON.stringify(data));

module.exports = {
  trace,
  getAllLibrarySnippets,
  writeFile,
  composeSnippets,
  namespaceSnippets,
};
