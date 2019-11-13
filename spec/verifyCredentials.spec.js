const { expect } = require('chai');
const { verify } = require('../verifyCredentials');
const {
  table, unevenTable, unevenTable2, largeTable, duplicateTable,
} = require('./testData');

describe('Verify tests', () => {
  it('Parses successfully', () => {
    verify({ table });
  });

  it('Recognizes an unrectangular table', () => {
    try {
      verify({ table: unevenTable });
    } catch (e) {
      expect(e.message).to.be.equal('In row 1; Too few fields: expected 3 fields but parsed 2');
    }
  });

  it('Recognizes an unrectangular table the other way', () => {
    try {
      verify({ table: unevenTable2 });
    } catch (e) {
      expect(e.message).to.be.equal('In row 2; Too many fields: expected 3 fields but parsed 4');
    }
  });

  it('Rejects CSVs that are too large', () => {
    try {
      verify({ table: largeTable });
    } catch (e) {
      expect(e.message).to.be.equal('CSV is too large');
    }
  });

  it('Rejects CSVs with duplicates', () => {
    try {
      verify({ table: duplicateTable });
    } catch (e) {
      expect(e.message).to.be.equal('Duplicates exist in the English column');
    }
  });
});
