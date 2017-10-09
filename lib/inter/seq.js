'use strict';

const Stmt = require('./stmt');

class Seq extends Stmt {
  constructor(pos, stmt1, stmt2) {
    super(pos);
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
  }

  gen(b, a) {

  }
}

module.exports = Seq;
