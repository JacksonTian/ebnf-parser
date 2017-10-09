'use strict';

const Tag = require('./tag');

class Token {
  constructor(tag) {
    this.tag = tag;
  }

  toString() {
    return this.tag;
  }
}

class Word extends Token {
  constructor(lexeme, tag) {
    super(tag);
    this.lexeme = lexeme;
  }

  toString() {
    return `Word ${this.lexeme} ${this.tag}`;
  }
}

function isLetter(c) {
  // letter = "A" … "Z" | "a" … "z"
  if (typeof c !== 'string') {
    return false;
  }

  var code = c.charCodeAt(0);
  return (code >= 0x41 && code <= 0x5a ||
    code >= 0x61 && code <= 0x7a);
}

function isDecimalDigit(c) {
  // decimalDigit = "0" … "9"
  var code = c.charCodeAt(0);
  return code >= 0x30 && code <= 0x39;
}

function isOctalDigit(c) {
  // octalDigit   = "0" … "7"
  var code = c.charCodeAt(0);
  return code >= 0x30 && code <= 0x37;
}

function isHexDigit(c) {
  // hexDigit     = "0" … "9" | "A" … "F" | "a" … "f"
  var code = c.charCodeAt(0);
  return (code >= 0x30 && code <= 0x39 ||
    code >= 0x41 && code <= 0x46 ||
    code >= 0x61 && code <= 0x66);
}

// ident = letter { letter | decimalDigit | "_" }
// fullIdent = ident { "." ident }
// messageName = ident
// enumName = ident
// fieldName = ident
// oneofName = ident
// mapName = ident
// serviceName = ident
// rpcName = ident
// messageType = [ "." ] { ident "." } messageName
// enumType = [ "." ] { ident "." } enumName

class Lexer {
  constructor(source, filename) {
    this.source = source;
    this.filename = filename;
    this.index = -1;
    this.peek = ' ';
    this.words = new Map();
    this.line = 1;
    this.column = 1;
    this.initReserveWords();
  }

  initReserveWords() {
    // reserve words
    // this.reserve(new Word('if', Tag.IF));
    // this.reserve(new Word("else",  Tag.ELSE));
    // this.reserve(new Word("while", Tag.WHILE));
    // this.reserve(new Word("do",    Tag.DO));
    // this.reserve(new Word("break", Tag.BREAK));
    // this.reserve(new Word("var", Tag.BASIC));

    // this.reserve(Word.True);
    // this.reserve(Word.False);

    // this.reserve(Type.Int);
    // this.reserve(Type.Char);
    // this.reserve(Type.Bool);
    // this.reserve(Type.Float);
    // this.reserve(Definition.message);
    // this.reserve(Definition.enum);
    // this.reserve(Definition.service);
  }

  reserve(word) {
    this.words.set(word.lexeme, word);
  }

  isReserved(key) {
    return this.words.has(key);
  }

  // read a char
  getch() {
    this.index++;
    this.column++;
    this.peek = this.source[this.index]; // 其它返回实际字节值
  }

  scan() {
    this.skipWhitespace();

    switch (this.peek) {
    case '"':
      var str = '';
      for ( ; ; ) {
        this.getch();
        if (this.peek === '"') {
          break;
        }

        if (this.peek) {
          str += this.peek;
        } else {
          throw new SyntaxError('Unexpect end of file');
        }
      }

      return new Word(str, Tag.LITERAL);
    case '\'':
      var str = '';
      for ( ; ; ) {
        this.getch();
        if (this.peek === '\'') {
          break;
        }

        if (this.peek) {
          str += this.peek;
        } else {
          throw new SyntaxError('Unexpect end of file');
        }
      }

      return new Word(str, Tag.LITERAL);
    }

    if (isLetter(this.peek)) {
      let str = '';
      do {
        str += this.peek;
        this.getch();
      } while (isLetter(this.peek) || isDecimalDigit(this.peek));

      //   if (this.isReserved(str)) {
      //     return this.words.get(str);
      //   }

      var word = new Word(str, Tag.RULE);
      this.words.set(str, word);
      return word;
    }

    var tok = new Token(this.peek);
    this.peek = ' ';
    return tok;
  }

  skipWhitespace() {
    this.getch();
    // 忽略空格,和TAB ch =='\n'
    while (this.peek === ' ' || this.peek === '\t' ||
      this.peek === '\n' || this.peek === '\r') {
      if (this.peek === '\n') {
        // line number
        this.line++;
        this.column = 0;
      }
      this.getch();
    }
  }
}

module.exports = Lexer;
