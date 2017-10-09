'use strict';

const Stmt = require('./stmt');

class Rule extends Stmt {
  constructor(pos, rule, stmt) {
    super(pos);
    this.rule = rule;
    this.stmt = stmt;
  }
}

module.exports = Rule;
