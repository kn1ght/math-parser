export enum TokenType {
  Number = 'number',
  DParameter = 'dParameter',
  FunctionSeparator = 'functionSeparator',
  Function = 'function',
  LeftParenthesis = 'leftParenthesis',
  RightParenthesis = 'rightParenthesis',
  Operator = 'operator',
}

const precedenceByOperator: { [key: string]: number } = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  getPrecedence = (): number => precedenceByOperator[this.value];
}

// MathExprTokenizer divides string into array of separate tokens (lexems)
export class MathExprTokenizer {
  private tokens: Token[] = [];

  private addToken = (type: TokenType, value: string): void => {
    const token = new Token(type, value);
    this.tokens.push(token);
  };

  private prepareString = (str: string): string => {
    str = this.deleteSpaces(str);
    str = this.replaceUnaryMinus(str);
    if (str[0] === '-') {
      str = '0' + str;
    }
    return str;
  };

  private deleteSpaces = (str: string): string => str.replace(/\s/g, '');

  private replaceUnaryMinus = (str: string): string =>
    str.replace('(-', '(0-').replace(',-', ',0-');

  private isDigit = (ch: string): boolean => /\d/.test(ch);
  private isLetter = (ch: string): boolean =>
    ch.toLowerCase() !== ch.toUpperCase();
  private isOperator = (ch: string): boolean => /\+|-|\*|\/|\^/.test(ch);
  private isLeftParenthesis = (ch: string): boolean => ch === '(';
  private isRightParenthesis = (ch: string): boolean => ch === ')';
  private isLeftBracket = (ch: string): boolean => ch === '[';
  private isRightBracket = (ch: string): boolean => ch === ']';
  private isComma = (ch: string): boolean => ch === ',';
  private isDot = (ch: string): boolean => ch === '.';

  tokenize = (str: string): MathExprTokenizer => {
    this.tokens = [];

    let digitsBuffer: string = '';
    let lettersBuffer: string = '';
    let dParameterBuffer: string = '';
    let isDParameterMode: boolean = false;

    const addNumberTokenAndClearDigitsBufferIfPossible = (): void => {
      if (digitsBuffer) {
        this.addToken(TokenType.Number, digitsBuffer);
        digitsBuffer = '';
      }
    };

    this.prepareString(str)
      .split('')
      .forEach(ch => {
        if (isDParameterMode && !this.isRightBracket(ch)) {
          dParameterBuffer += ch;
        } else if (this.isLeftBracket(ch)) {
          isDParameterMode = true;
        } else if (this.isRightBracket(ch)) {
          this.addToken(TokenType.DParameter, dParameterBuffer);
          dParameterBuffer = '';
          isDParameterMode = false;
        } else if (this.isLetter(ch)) {
          lettersBuffer += ch;
        } else if (this.isDigit(ch) || this.isDot(ch)) {
          digitsBuffer += ch;
        } else if (this.isComma(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.FunctionSeparator, ch);
        } else if (this.isLeftParenthesis(ch)) {
          if (lettersBuffer) {
            this.addToken(TokenType.Function, lettersBuffer);
            lettersBuffer = '';
          }
          this.addToken(TokenType.LeftParenthesis, ch);
        } else if (this.isRightParenthesis(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.RightParenthesis, ch);
        } else if (this.isOperator(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.Operator, ch);
        }
      });

    addNumberTokenAndClearDigitsBufferIfPossible();

    return this;
  };

  getTokens = (): Token[] => this.tokens;
}
