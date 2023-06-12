/* eslint-disable no-restricted-syntax, no-await-in-loop, consistent-return */
const parser = require('papaparse');
const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  const {
    from, to, table, duplicates = 'throwError',
  } = cfg;
  if (from === to) throw new Error('Please select different columns to translate between');
  if (!msg.body.input) {
    if (cfg.emitEmptyObject) return messages.newEmptyMessage();
    throw new Error('Value does not exist in table selected');
  }

  const parsedData = parser.parse(table, { header: true, skipEmptyLines: 'greedy' });
  const rows = parsedData.data.filter((r) => r[from] === msg.body.input.toString());


  if (!rows.length && cfg.emitEmptyObject) {
    return messages.newEmptyMessage();
  }
  if (!rows.length) throw new Error('Value does not exist in table selected');
  if (rows.length > 1) {
    if (duplicates === 'throwError') throw new Error('Duplicates exist in the selected column');
    if (duplicates === 'emitFirst') return messages.newMessageWithBody({ result: rows[0][to] });
    if (duplicates === 'emitAllArray') return messages.newMessageWithBody({ result: rows.map((row) => row[to]) });
    if (duplicates === 'emitAllIndividually') {
      for (const row of rows) {
        await this.emit('data', messages.newMessageWithBody({ result: row[to] }));
      }
      return;
    }
  }

  return messages.newMessageWithBody({ result: rows[0][to] });
};

exports.dictionaryColumns = function dictionaryColumns(cfg) {
  const parsedData = parser.parse(cfg.table, { header: true });
  return parsedData.meta.fields.reduce((prev, field) => ({ ...prev, [field]: field }), {});
};

exports.getMetaModel = function getMetaModel(cfg) {
  const parsedData = parser.parse(cfg.table, { header: true, skipEmptyLines: 'greedy' });

  const inMetadata = {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        title: 'Input',
        required: true,
        enum: parsedData.data.map((row) => row[cfg.from]),
      },
    },
  };

  const outMetadata = {
    type: 'object',
    properties: {
      result: {
        type: 'string',
      },
    },
  };

  return {
    in: inMetadata,
    out: outMetadata,
  };
};
