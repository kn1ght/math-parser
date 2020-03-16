import { MathExprParser } from '../src/MathExprParser/index';
import { AST } from '../src/AST/index';
import { Token, TokenType } from '../src/MathExprTokenizer/Token';

describe('MathExprParser', () => {
  const nameToFunctionMap = {
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
  };

  const nameToArgumentsQuantityMap = {
    max: 2,
    min: 2,
    pow: 2,
  };

  const variablesMap = {
    x: 1,
    y: 2,
    z: 3,
  };

  const mathExprParser = new MathExprParser({
    nameToFunctionMap,
    nameToArgumentsQuantityMap,
    variablesMap,
    variableMarks: ['{', '}'],
  });

  const mathExpr =
    'pow({y}, 3) * (max({x}, 2) + pow(min({z}, 5), {y})) + 12.5 + (5 ^ 2)';

  test('test RPN', () => {
    const rpn = 'y 3 pow x 2 max z 5 min y pow + * 12.5 + 5 2 ^ +';

    expect(
      mathExprParser
        .parse(mathExpr)
        .getRPN()
        .map(t => t.value)
        .join(' '),
    ).toBe(rpn);
  });

  // todo: test complex AST
  test('test AST', () => {
    const numAst1 = new AST(new Token(TokenType.Number, '4'), []);
    const numAst2 = new AST(new Token(TokenType.Number, '2'), []);
    const rootAst = new AST(new Token(TokenType.Operator, '/'), [
      numAst1,
      numAst2,
    ]);

    expect(JSON.stringify(mathExprParser.parse('4 / 2').getAST())).toBe(
      JSON.stringify(rootAst),
    );
  });

  test('test evaluate', () => {
    expect(mathExprParser.parse(mathExpr).evaluate()).toBe(125.5);
  });
});
