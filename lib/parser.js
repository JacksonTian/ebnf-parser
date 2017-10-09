'use strict';

const Tag = require('./tag');

class Stmt {

}

class Alternation extends Stmt {
  constructor(stmt1, stmt2) {
    super();
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
  }
}

class Concatenation extends Stmt {
  constructor(stmt1, stmt2) {
    super();
    this.stmt1 = stmt1;
    this.stmt2 = stmt2;
  }
}

class Repetition extends Stmt {
  constructor(stmt) {
    super();
    this.stmt = stmt;
  }
}


class Rule extends Stmt {
  constructor(rule, stmt) {
    super();
    this.rule = rule;
    this.stmt = stmt;
  }
}

Rule.Null = new Rule(null, null);

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.look = null;
    this.move();
  }

  move() {
    this.look = this.lexer.scan();
  }

  error(message) {
    console.log(`${this.lexer.filename}:${this.lexer.line}`);
    console.log(`${this.lexer.source.split('\n')[this.lexer.line - 1]}`);
    console.log(`${' '.repeat(this.lexer.column - 1)}^`);
    throw new SyntaxError(message);
  }

  program() {
    this.grammar();
  }

  grammar() {
    var rules = [];
    var r;
    do {
      r = this.rule();
      rules.push(r);
    } while (r !== Rule.Null);
    console.log(rules);
    return rules;
  }

  rule() {
    if (!this.look.tag) {
      return Rule.Null;
    }

    var rule = this.lhs();
    this.match('=');
    var definition = this.rhs();
    this.match(';');
    return new Rule(rule, definition);
  }

  lhs() {
    if (this.look.tag === Tag.RULE) {
      this.move();
      return ;
    }
  }

  match(token) {
    if (this.look.tag === token) {
      this.move();
    } else {
      this.error(`expect ${token}, but ${this.look}`);
    }
  }

  rhs() {
    var s;

    if (this.look.tag === ';') {
      return '';
    }

    if (this.look.tag === Tag.RULE ||
      this.look.tag === Tag.LITERAL) {
      s = this.look;
    }

    if (this.look.tag === '[') {
      s = new Optional();
    } else if (this.look.tag === '{') {
      this.move();
      s = new Repetition(this.rhs());
    } else if (this.look.tag === '(') {
      s = new Grouping();
    }

    this.move();

    if (this.look.tag === '|') {
      this.move();
      return new Alternation(s, this.rhs());
    }

    if (this.look.tag === ',') {
      this.move();
      return new Concatenation(s, this.rhs());
    }
  }
}

module.exports = Parser;
