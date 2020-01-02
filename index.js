// 4. map through and process every entry: add library name as [0] el to prefix
// 5. concat into one big file: add every entry from every entry like this:
//
// before, XXXX.js
// {
//   "someStrangeSnippetName": {
//     description: "",
//     prefix: [],
//     body: "",
//   }
// }
// after:
// {
//   "XXXX_01": {
//     same stuff
//   }
// }
const fs = require('fs');

const fsPromises = fs.promises;
const https = require('https');
const dependencies = require('./test-dependency-list');
const { reduce, map, compose, prop, forEach } = require('./helpers/common');
const { trace } = require('./helpers/local');

// helpers

const formatCompose = reduce(
  (acc, cur) => ({
    ...acc,
    ...cur.snippets
      .map(([key, val]) => ({ [key]: { ...val } }))
      .reduce(
        (acc, cur) => ({
          ...acc,
          [Object.keys(cur)[0]]: Object.values(cur)[0],
        }),
        {}
      ),
  }),
  {}
);

const flatNamespace = ({ name, snippets }) => ({
  snippets: Object.entries(snippets).map(([key, val], i) => [
    `${name}_${i}_${key}`,
    {
      ...val,
      prefix: [name].concat(
        Array.isArray(val.prefix) ? val.prefix : [val.prefix]
      ),
    },
  ]),
});

const writeFile = (path) => (data) =>
  fsPromises.writeFile(path, JSON.stringify(data));

const processRowSnippetsData = compose(
  writeFile(`${__dirname}/test.json`),
  formatCompose,
  map(flatNamespace)
);

const getLibrarySnippets = (lib, link) =>
  new Promise((resolve, reject) =>
    https
      .get(link, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve({
            name: lib,
            snippets: JSON.parse(data),
          });
        });
      })
      .on('error', (err) => {
        reject(`Error: ${err.message}`);
      })
  );

const getAllLibrarySnippets = () =>
  Promise.all(
    dependencies.map(({ name, snippetsLink }) =>
      getLibrarySnippets(name, snippetsLink)
    )
  );

const main = () => getAllLibrarySnippets().then(processRowSnippetsData);

main();
