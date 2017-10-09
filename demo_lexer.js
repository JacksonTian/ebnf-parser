'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'spec/ebnf.ebnf');
const source = fs.readFileSync(filePath, 'utf8');

const Lexer = require('./lib/lexer');

var lexer = new Lexer(source, filePath);

var token;
do {
  token = lexer.scan();
  console.log(token.toString());
} while (token.tag);
