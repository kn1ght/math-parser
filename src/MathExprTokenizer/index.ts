import { MathExprHelper } from '../MathExprHelper/index';
import { Token, TokenType } from './Token';

// MathExprTokenizer divides string into array of separate tokens (lexems)
export class MathExprTokenizer {
  private tokens: Token[] = [];

  tokenize = (str: string): MathExprTokenizer => {
    this.clearMemory();

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
        if (isDParameterMode && !MathExprHelper.isRightBracket(ch)) {
          dParameterBuffer += ch;
        } else if (MathExprHelper.isLeftBracket(ch)) {
          isDParameterMode = true;
        } else if (MathExprHelper.isRightBracket(ch)) {
          this.addToken(TokenType.DParameter, dParameterBuffer);
          dParameterBuffer = '';
          isDParameterMode = false;
        } else if (MathExprHelper.isLetter(ch)) {
          lettersBuffer += ch;
        } else if (MathExprHelper.isDigit(ch) || MathExprHelper.isDot(ch)) {
          digitsBuffer += ch;
        } else if (MathExprHelper.isComma(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.FunctionSeparator, ch);
        } else if (MathExprHelper.isLeftParenthesis(ch)) {
          if (lettersBuffer) {
            this.addToken(TokenType.Function, lettersBuffer);
            lettersBuffer = '';
          }
          this.addToken(TokenType.LeftParenthesis, ch);
        } else if (MathExprHelper.isRightParenthesis(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.RightParenthesis, ch);
        } else if (MathExprHelper.isOperator(ch)) {
          addNumberTokenAndClearDigitsBufferIfPossible();
          this.addToken(TokenType.Operator, ch);
        }
      });

    addNumberTokenAndClearDigitsBufferIfPossible();

    return this;
  };

  getTokens = (): Token[] => this.tokens;

  private addToken = (type: TokenType, value: string): void => {
    const token = new Token(type, value);
    this.tokens.push(token);
  };

  private prepareString = (str: string): string => {
    str = MathExprHelper.deleteSpaces(str);
    str = MathExprHelper.replaceUnaryMinus(str);
    if (str[0] === '-') {
      str = '0' + str;
    }
    return str;
  };

  private clearMemory = (): void => {
    this.tokens = [];
  };
}
