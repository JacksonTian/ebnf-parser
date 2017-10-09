# EBNF parser

## Lexer

```js
const { Lexer } = require('ebnf.js');

var lexer = new Lexer(source, '/fake/test.ebnf');

var tokens = [];
var token;
do {
  token = lexer.scan();
  tokens.push(token);
} while (token.tag);
return tokens;
```

## Parser

```js
const { Lexer, Parser } = require('ebnf.js');

var lexer = new Lexer(source, '/fake/test.ebnf');
var parser = new Parser(lexer);
return parser.program();
```

## Referrences

- See [Extended Backus–Naur form](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form)

## License
The MIT license
