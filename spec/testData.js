const table = `English,Abbreviated,German
male,M,männlich
female,F,weiblich
other,O,divers
unknown,U,unbekannt`;

const unevenTable = `English,Abbreviated,German
male,M,männlich
female,F
other,O,divers
unknown,U,unbekannt`;

const unevenTable2 = `English,Abbreviated,German
male,M,männlich
female,F,weiblich
other,O,divers,extra
unknown,U,unbekannt`;

const largeTable = require('./largeTable');

const duplicateTable = `English,Abbreviated,German
male,M,männlich
male,F,weiblich
other,O,divers
unknown,U,unbekannt`;

module.exports = {
  table,
  unevenTable,
  unevenTable2,
  largeTable,
  duplicateTable,
};
