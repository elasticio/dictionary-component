const { expect } = require('chai');
const sinon = require('sinon');
const action = require('../../lib/actions/lookupFromDictionary');
const { table, tableWithWeirdValues } = require('../testData');

const self = {
  emit: sinon.spy(),
};

const msg = {
  body: {
    input: 'hello',
  },
};

describe('Tests for lookup from dictionary', () => {
  beforeEach(() => self.emit.resetHistory());

  it('Returns the correct column titles from Select Views', () => {
    const result = action.dictionaryColumns({ table });
    expect(result).to.deep.equal({
      English: 'English',
      Abbreviated: 'Abbreviated',
      German: 'German',
    });
  });

  it('Returns the correct schema from getMetaModel', () => {
    const result = action.getMetaModel({ table, from: 'English', to: 'German' });
    expect(result).to.be.deep.equal({
      in: {
        type: 'object',
        properties: {
          input: {
            type: 'string', title: 'Input', required: true, enum: ['male', 'female', 'other', 'unknown'],
          },
        },
      },
      out: { type: 'object', properties: { result: { type: 'string' } } },
    });
  });

  it('Throws an error if the same columns are selected to compare between', async () => {
    try {
      await action.process(msg, { table, from: 'English', to: 'English' });
    } catch (e) {
      expect(e.message).to.be.equal('Please select different columns to translate between');
    }
  });

  it('Throws an error if trying to lookup an input value that does not exist', async () => {
    try {
      const cfg = {
        table, from: 'English', to: 'German', emitEmptyObject: false,
      };
      await action.process(msg, cfg);
    } catch (e) {
      expect(e.message).to.be.equal('Value does not exist in dictionary selected');
    }
  });

  it('Emits an empty message if tryin to lookup an input value that does not exist', () => {
    const cfg = {
      table, from: 'English', to: 'German', emitEmptyObject: true,
    };
    const result = action.process(msg, cfg);
    expect(result.body).to.be.deep.equal({ });
  });

  it('Successfully looks up a value in the table and returns the correct value in response', () => {
    msg.body.input = 'male';
    const result = action.process(msg, { table, from: 'English', to: 'German' });
    expect(result.body).to.be.deep.equal({ result: 'männlich' });
  });

  it('Successfully does lookups with things with extra commas and quotations', async () => {
    msg.body.input = 'm,a,l,e';
    const result = action.process(msg, { table: tableWithWeirdValues, from: 'English', to: 'German' });
    expect(result.body).to.be.deep.equal({ result: 'mä,nn"lich' });
  });
});
