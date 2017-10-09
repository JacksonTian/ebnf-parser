'use strict';

const Stmt = require('./stmt');

class Grouping extends Stmt {
  constructor(pos, stmt) {
    super(pos);
    this.stmt = stmt;
  }
}

module.exports = Grouping;
