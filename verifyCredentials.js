const parser = require('papaparse');
const util = require('util');

const MAX_SIZE = 5000;

function duplicatesExist(arr) {
  return new Set(arr).size !== arr.length;
}

module.exports = function verify(cfg) {
  const size = (new util.TextEncoder().encode(cfg.table)).length;
  if (size > MAX_SIZE) throw new Error('CSV is too large');

  const results = parser.parse(cfg.table, { header: true });

  if (results.errors.length) {
    const errorMessage = results.errors.reduce((prev, err) => {
      const del = prev === '' ? prev : '\n';
      return `${prev}${del}In row ${err.row}; ${err.message}`;
    }, '');
    throw new Error(errorMessage);
  }

  results.meta.fields.forEach((field) => {
    const column = results.data.map((obj) => obj[field]);
    if (duplicatesExist(column)) throw new Error(`Duplicates exist in the ${field} column`);
  });

  return true;
};
