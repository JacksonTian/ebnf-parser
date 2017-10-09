'use strict';

const Stmt = require('./stmt');

class Repetition extends Stmt {
  constructor(stmt) {
    super();
    this.stmt = stmt;
  }
}

module.exports = Repetition;
