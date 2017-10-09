'use strict';

const Node = require('./node');

class Stmt extends Node {
  constructor(pos) {
    super(pos);
    // this.after = 0;
  }

  gen(b, a) {

  }
}

Stmt.Null = new Stmt(0);

module.exports = Stmt;
