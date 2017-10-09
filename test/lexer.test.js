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
  it('repetition should ok', function () {
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
});
