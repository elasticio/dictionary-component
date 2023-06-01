const { expect } = require('chai');
const verify = require('../verifyCredentials');
const {
  table, unevenTable, unevenTable2, largeTable,
} = require('./testData');

describe('Verify tests', () => {
  let eMessage;
  beforeEach(() => {
    eMessage = undefined;
  });

  it('Parses successfully', () => {
    verify({ table });
  });

  it('Recognizes an unrectangular table', () => {
    try {
      verify({ table: unevenTable });
    } catch (e) {
      eMessage = e.message;
    }
    expect(eMessage).to.be.equal('In row 1; Too few fields: expected 3 fields but parsed 2');
  });

  it('Recognizes an unrectangular table the other way', () => {
    try {
      verify({ table: unevenTable2 });
    } catch (e) {
      eMessage = e.message;
    }
    expect(eMessage).to.be.equal('In row 2; Too many fields: expected 3 fields but parsed 4');
  });

  it('Rejects CSVs that are too large', () => {
    try {
      verify({ table: largeTable });
    } catch (e) {
      eMessage = e.message;
    }
    expect(eMessage).to.be.equal('CSV is too large');
  });
});
