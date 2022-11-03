const parser = require('papaparse');
const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  if (cfg.from === cfg.to) throw new Error('Please select different columns to translate between');

  const parsedData = parser.parse(cfg.table, { header: true });
  const row = parsedData.data.filter((r) => r[cfg.from] === msg.body.input.toString());

  if (!row.length && cfg.emitEmptyObject) {
    return messages.newEmptyMessage();
  }
  if (!row.length) throw new Error('Value does not exist in table selected');
  if (row.length !== 1) throw new Error('Error in locating value');

  return messages.newMessageWithBody({ result: row[0][cfg.to] });
};

exports.dictionaryColumns = function dictionaryColumns(cfg) {
  const parsedData = parser.parse(cfg.table, { header: true });
  return parsedData.meta.fields.reduce((prev, field) => ({ ...prev, [field]: field }), {});
};

exports.getMetaModel = function getMetaModel(cfg) {
  const parsedData = parser.parse(cfg.table, { header: true });

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
