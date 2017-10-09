'use strict';

const Stmt = require('./stmt');

class Alternation extends Stmt {
  constructor(stmt1, stmt2) {
    super();
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
  }
}

module.exports = Alternation;
