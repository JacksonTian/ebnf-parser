'use strict';

const Stmt = require('./stmt');

class Repetition extends Stmt {
  constructor(pos, stmt) {
    super(pos);
    this.stmt = stmt;
  }
}

module.exports = Repetition;
