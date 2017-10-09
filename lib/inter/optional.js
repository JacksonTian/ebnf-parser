'use strict';

const Stmt = require('./stmt');

class Optional extends Stmt {
  constructor(pos, stmt) {
    super(pos);
    this.stmt = stmt;
  }
}

module.exports = Optional;
