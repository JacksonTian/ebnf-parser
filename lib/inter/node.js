'use strict';

class Node {
  constructor(pos = {}) {
    this.line = pos.line;
    this.column = pos.column;
  }

  error(str) {
    throw new Error('near line ' + this.line + ': ' + str);
  }
}

module.exports = Node;
