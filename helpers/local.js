const { curry } = require('./common');

const trace = curry((tag = 'Tracing:') => (data) => {
  console.log(
    `\n${tag}:${typeof data === 'object' ? JSON.stringify(data) : data}\n`
  );
  return data;
});

module.exports = { trace };
