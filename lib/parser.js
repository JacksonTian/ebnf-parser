'use strict';

const Tag = require('./tag');

const Alternation = require('./inter/alternation');
const Concatenation = require('./inter/concatenation');
const Repetition = require('./inter/repetition');
const Rule = require('./inter/rule');
const Stmt = require('./inter/stmt');
const Seq = require('./inter/seq');

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
    return this.grammar();
    // console.log(JSON.stringify(ast, null, 2));
  }

  grammar() {
    var rule = this.rule();
    if (rule === Stmt.Null) {
      return rule;
    }

    return new Seq({}, rule, this.grammar());
  }

  rule() {
    if (!this.look.tag) {
      return Stmt.Null;
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
      return this.look;
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
