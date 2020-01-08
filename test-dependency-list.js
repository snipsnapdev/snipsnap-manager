const snipsnapLibsCollection = [
  {
    name: 'react',
    libSource: ['https://github.com/facebook/react'],
    snippetSource: [
      'https://raw.githubusercontent.com/dsznajder/vscode-es7-javascript-react-snippets/master/snippets/snippets.json',
    ],
    scope: 'javascript, javascriptreact',
  },
  {
    name: 'typescriptreact',
    libSource: 'https://github.com/microsoft/TypeScript',
    snippetSource: [
      'https://raw.githubusercontent.com/dsznajder/vscode-es7-javascript-react-snippets/master/snippets/ts-snippets.json',
    ],
    scope: 'typescript, typescriptreact',
  },
  {
    name: 'javascript',
    libSource: 'https://github.com/tc39/ecma262',
    snippetSource: [
      'https://raw.githubusercontent.com/dsznajder/vscode-es7-javascript-react-snippets/master/snippets/snippets.json',
    ],
    scope: 'javascript',
  },
  {
    name: 'angular',
    libSource: 'https://github.com/angular/angular',
    snippetSource: [
      'https://raw.githubusercontent.com/johnpapa/vscode-angular-snippets/master/snippets/dockerfile.json',
      'https://raw.githubusercontent.com/johnpapa/vscode-angular-snippets/master/snippets/html.json',
      'https://raw.githubusercontent.com/johnpapa/vscode-angular-snippets/master/snippets/javascript.json',
      'https://raw.githubusercontent.com/johnpapa/vscode-angular-snippets/master/snippets/typescript.json',
    ],
    scope: 'javascript, html, jsonc, dockerfile',
  },
];

module.exports = snipsnapLibsCollection;
