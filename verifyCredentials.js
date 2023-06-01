const parser = require('papaparse');
const util = require('util');

const MAX_SIZE = 5000;

module.exports = function verify(cfg) {
  const size = (new util.TextEncoder().encode(cfg.table)).length;
  if (size > MAX_SIZE) throw new Error('CSV is too large');

  const results = parser.parse(cfg.table, { header: true, skipEmptyLines: 'greedy' });

  if (results.errors.length) {
    const errorMessage = results.errors.reduce((prev, err) => {
      const del = prev === '' ? prev : '\n';
      return `${prev}${del}In row ${err.row}; ${err.message}`;
    }, '');
    throw new Error(errorMessage);
  }

  return true;
};
