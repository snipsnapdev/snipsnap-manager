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

const prepareSnippetKey = (key) => {
  const isCamelCase = !!key.split(' ').length;
  if (isCamelCase) {
    return Array.from(
      new Set(
        key
          // convert from camelCase to no camel case
          .replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5')
          .replace(/[{}]/g, '')
          .replace(/&/g, 'and')
          .toLowerCase()
          .split(' ')
      )
    ).join(' ');
  }
  return Array.from(
    new Set(
      ...key
        .toLowerCase()
        .replace(/[{}]/g, '')
        .replace(/&/g, 'and')
        .split(' ')
    )
  ).join(' ');
};

// flattens 2d snippet array into array of objects
// composeSnippets({name: String, snippets: [Array]}) -> Array
const composeSnippets = map(({ name, snippets }) => ({
  name,
  snippets: snippets.map(([key, val]) => ({ [key]: { ...val } })),
}));

// transforms foreign library naming format into snipsnap's
// namespaceSnippets({name: String, snippets: Arrary}) -> Array
const namespaceSnippets = map(({ name, snippets, scope }) => ({
  name,
  snippets: Object.entries(snippets).map(([key, val], i) => [
    key,
    {
      ...val,
      // adjusting prefix
      prefix: [prepareSnippetKey(`${name} ${key}`)].concat(
        Array.isArray(val.prefix) ? val.prefix : [val.prefix]
      ),
      scope,
    },
  ]),
}));

// standart node https request wrapped in a promise
// getLibrarySnippets(lib: String, sources: Array ) -> Promise
const getLibrarySnippets = (libName, sources, scope) =>
  Promise.all(
    sources.map(
      (url) =>
        new Promise((resolve, reject) =>
          https
            .get(url, (resp) => {
              let data = '';

              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });

              // The whole response has been received. Print out the result.
              resp.on('end', () => resolve(JSON.parse(data)));
            })
            .on('error', (err) => reject(`Error: ${err.message}`))
        )
    )
  ).then((values) =>
    Promise.resolve({
      name: libName,
      snippets: values.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
      scope,
    })
  );

// same as above but handles batch requests
// getAllLibrarySnippets(processEntryFn: Function) -> (libraries: Array) -> Promise
const getAllLibrarySnippets = ((processEntryFn) => (libraries) =>
  Promise.all(
    libraries.map(({ name, snippetSource, scope }) =>
      processEntryFn(name, snippetSource, scope)
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
