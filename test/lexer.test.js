'use strict';

const assert = require('assert');

const Lexer = require('../lib/lexer');

function lexer(source) {
  var lexer = new Lexer(source, '/fake/test.ebnf');

  var tokens = [];
  var token;
  do {
    token = lexer.scan();
    tokens.push(token);
  } while (token.tag);
  return tokens;
}

describe('lexer', function () {
  it('letter double quote should ok', function () {
    var tokens = lexer('letter = "A";');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'letter',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'lexeme': 'A',
        'tag': 2
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });

  it('letter single quote should ok', function () {
    var tokens = lexer('letter = \'A\';');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'letter',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'lexeme': 'A',
        'tag': 2
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });

  it('id = id should ok', function () {
    var tokens = lexer('A = B;');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'A',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });
});
