'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../spec/ebnf.ebnf');
const source = fs.readFileSync(filePath, 'utf8');

const Lexer = require('../lib/lexer');
const Parser = require('../lib/parser');

var lexer = new Lexer(source, filePath);
var parser = new Parser(lexer);

parser.program();
