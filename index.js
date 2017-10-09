'use strict';

const Lexer = require('./lib/lexer');
const Parser = require('./lib/parser');

exports.parse = function (source, filename) {
  var lexer = new Lexer(source, filename);
  var parser = new Parser(lexer);
  return parser.program();
};

exports.Lexer = Lexer;
exports.Parser = Parser;
