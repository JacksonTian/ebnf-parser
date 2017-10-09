'use strict';

const assert = require('assert');

const Lexer = require('../lib/lexer');

function lex(source) {
  var lexer = new Lexer(source, '/fake/test.ebnf');

  var tokens = [];
  var token;
  do {
    token = lexer.scan();
    tokens.push(token);
  } while (token.tag);
  return tokens;
}

describe('lex', function () {
  it('letter double quote should ok', function () {
    var tokens = lex('letter = "A";');
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
    var tokens = lex('letter = \'A\';');
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
    var tokens = lex('A = B;');
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

  it('id = id | id should ok', function () {
    var tokens = lex('A = B | C;');
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
        'tag': '|'
      },
      {
        'lexeme': 'C',
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

  it('id = id , id should ok', function () {
    var tokens = lex('A = B , C;');
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
        'tag': ','
      },
      {
        'lexeme': 'C',
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

  it('id = { id } should ok', function () {
    var tokens = lex('A = { B };');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'A',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'tag': '{'
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': '}'
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });

  it('id = [ id ] should ok', function () {
    var tokens = lex('A = [ B ];');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'A',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'tag': '['
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': ']'
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });

  it('id = ( id ) should ok', function () {
    var tokens = lex('A = ( B );');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'A',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'tag': '('
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': ')'
      },
      {
        'tag': ';'
      },
      {
        'tag': undefined
      }
    ]);
  });

  it('multiline should ok', function () {
    var tokens = lex('A = ( B );\nB = "C";');
    assert.deepEqual(tokens, [
      {
        'lexeme': 'A',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'tag': '('
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': ')'
      },
      {
        'tag': ';'
      },
      {
        'lexeme': 'B',
        'tag': 1
      },
      {
        'tag': '='
      },
      {
        'lexeme': 'C',
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

  it('invalid rule should ok', function () {
    assert.throws(
      () => {
        lex('A = "C');
      },
      function(err) {
        if (err.message === 'Unexpect end of file') {
          return true;
        }
      }
    );
    assert.throws(
      () => {
        lex('A = \'C');
      },
      function(err) {
        if (err.message === 'Unexpect end of file') {
          return true;
        }
      }
    );
  });
});
