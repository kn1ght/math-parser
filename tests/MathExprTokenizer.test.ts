import { MathExprTokenizer } from '../src/MathExprTokenizer/index';
import { Token, TokenType } from '../src/MathExprTokenizer/Token';

describe('MathExprTokenizer', () => {
  const mathExprTokenizer = new MathExprTokenizer();

  test('tokenize string', () => {
    mathExprTokenizer.tokenize('(-1 + [var]) / pow(2.5, 3) + #10/10/2020#');
    const tokens: Token[] = [];
    tokens.push(new Token(TokenType.LeftParenthesis, '('));
    tokens.push(new Token(TokenType.Number, '0'));
    tokens.push(new Token(TokenType.Operator, '-'));
    tokens.push(new Token(TokenType.Number, '1'));
    tokens.push(new Token(TokenType.Operator, '+'));
    tokens.push(new Token(TokenType.Variable, 'var'));
    tokens.push(new Token(TokenType.RightParenthesis, ')'));
    tokens.push(new Token(TokenType.Operator, '/'));
    tokens.push(new Token(TokenType.Function, 'pow'));
    tokens.push(new Token(TokenType.LeftParenthesis, '('));
    tokens.push(new Token(TokenType.Number, '2.5'));
    tokens.push(new Token(TokenType.FunctionSeparator, ','));
    tokens.push(new Token(TokenType.Number, '3'));
    tokens.push(new Token(TokenType.RightParenthesis, ')'));
    tokens.push(new Token(TokenType.Operator, '+'));
    tokens.push(new Token(TokenType.Date, '10/10/2020'));

    const toStr = (t: Token) => t.value + t.type;

    expect(
      mathExprTokenizer
        .getTokens()
        .map(toStr)
        .join('|'),
    ).toBe(tokens.map(toStr).join('|'));
  });
});
