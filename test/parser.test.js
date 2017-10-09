'use strict';

const assert = require('assert');

const Tag = require('../lib/tag');

const Lexer = require('../lib/lexer');
const Parser = require('../lib/parser');

function parse(source) {
  var lexer = new Lexer(source, '/fake/test.ebnf');
  var parser = new Parser(lexer);
  return parser.program();
}

function isRule(rule, lexeme) {
  assert.equal(rule.tag, Tag.RULE);
  assert.equal(rule.lexeme, lexeme);
}

function isStmtNull(stmt) {
  assert.equal(stmt.constructor.name, 'Stmt');
  assert.equal(stmt.tag, undefined);
}

describe('parse', function () {
  it('letter double quote should ok', function () {
    var ast = parse('letter = "A";');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'letter');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.tag, Tag.LITERAL);
    assert.equal(stmt.lexeme, 'A');
    isStmtNull(ast.stmt2);
  });

  it('letter single quote should ok', function () {
    var ast = parse('letter = \'A\';');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'letter');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.tag, Tag.LITERAL);
    assert.equal(stmt.lexeme, 'A');
    isStmtNull(ast.stmt2);
  });

  it('id = id should ok', function () {
    var ast = parse('A = B;');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.tag, Tag.RULE);
    assert.equal(stmt.lexeme, 'B');
    isStmtNull(ast.stmt2);
  });

  it('id = id | id should ok', function () {
    var ast = parse('A = B | C;');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Alternation');
    isRule(stmt.stmt1, 'B');
    isRule(stmt.stmt2, 'C');

    isStmtNull(ast.stmt2);
  });

  it('id = id , id should ok', function () {
    var ast = parse('A = B , C;');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Concatenation');
    isRule(stmt.stmt1, 'B');
    isRule(stmt.stmt2, 'C');

    isStmtNull(ast.stmt2);
  });

  it('id = { id } should ok', function () {
    var ast = parse('A = { B };');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Repetition');
    isRule(stmt.stmt, 'B');

    isStmtNull(ast.stmt2);
  });

  it('id = [ id ] should ok', function () {
    var ast = parse('A = [ B ];');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Optional');
    isRule(stmt.stmt, 'B');

    isStmtNull(ast.stmt2);
  });

  it('id = ( id ) should ok', function () {
    var ast = parse('A = ( B );');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Grouping');
    isRule(stmt.stmt, 'B');

    isStmtNull(ast.stmt2);
  });

  it('multiline should ok', function () {
    var ast = parse('A = ( B );\nB = "C";');
    assert.equal(ast.constructor.name, 'Seq');
    assert.equal(ast.stmt1.constructor.name, 'Rule');
    isRule(ast.stmt1.rule, 'A');
    var stmt = ast.stmt1.stmt;
    assert.equal(stmt.constructor.name, 'Grouping');
    isRule(stmt.stmt, 'B');

    var stmt2 = ast.stmt2;
    assert.equal(stmt2.constructor.name, 'Seq');
    assert.equal(stmt2.stmt1.constructor.name, 'Rule');
    isRule(stmt2.stmt1.rule, 'B');
    assert.equal(stmt2.stmt1.stmt.tag, Tag.LITERAL);
    assert.equal(stmt2.stmt1.stmt.lexeme, 'C');

    isStmtNull(ast.stmt2.stmt2);
  });

  it('invalid rule should ok', function () {
    assert.throws(
      () => {
        parse('A = "C');
      },
      function(err) {
        if (err.message === 'Unexpect end of file') {
          return true;
        }
      }
    );
    assert.throws(
      () => {
        parse('A = \'C');
      },
      function(err) {
        if (err.message === 'Unexpect end of file') {
          return true;
        }
      }
    );
  });
});
