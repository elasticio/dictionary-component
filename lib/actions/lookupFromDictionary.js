const parser = require('papaparse');
const { messages } = require('elasticio-node');

let parsedData = null;

exports.process = async function process(msg, cfg) {
  if (cfg.from === cfg.to) throw new Error('Please select different columns to translate between');

  if (parsedData === null) parsedData = parser.parse(cfg.table, { header: true });
  const row = parsedData.data.filter((r) => r[cfg.from] === msg.body.input);

  if (!row.length && cfg.emitEmptyObject) {
    await this.emit('data', messages.newEmptyMessage());
    return;
  }
  if (!row.length) throw new Error('Value does not exist in dictionary');
  if (row.length !== 1) throw new Error('Error in locating value');

  await this.emit('data', messages.newMessageWithBody({ result: row[0][cfg.to] }));
};

exports.dictionaryColumns = function dictionaryColumns(cfg) {
  if (parsedData === null) parsedData = parser.parse(cfg.table, { header: true });
  return parsedData.meta.fields;
};

exports.getMetaModel = function getMetaModel(cfg) {
  if (parsedData === null) parsedData = parser.parse(cfg.table, { header: true });
  const inMetadata = {
    input: {
      type: 'string',
      title: 'Input',
      required: true,
      enum: parsedData.data.map((row) => row[cfg.from]),
    },
  };

  const outMetadata = {
    type: 'object',
    properties: {
      [cfg.to]: {
        type: 'string',
      },
    },
  };

  return {
    in: inMetadata,
    out: outMetadata,
  };
};
