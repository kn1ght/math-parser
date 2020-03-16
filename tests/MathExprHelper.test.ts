import { MathExprHelper } from '../src/MathExprHelper/index';

describe('MathExprHelper', () => {
  const testExpr = ' ( - 1 + 2 ) / pow (  2 , - 3 ) ';
  const testExprWithoutSpaces = MathExprHelper.deleteSpaces(testExpr);

  test('deleteSpaces', () => {
    expect(testExprWithoutSpaces).toBe('(-1+2)/pow(2,-3)');
  });

  test('replaceUnaryMinus', () => {
    expect(MathExprHelper.replaceUnaryMinus(testExprWithoutSpaces)).toBe(
      '(0-1+2)/pow(2,0-3)',
    );
  });

  test('hasLettersOrDigits', () => {
    const symbolsStr = '!@#$%^&*()[]{}-=/,.;:\'"|`~';
    expect(MathExprHelper.hasLettersOrDigits('a1')).toBe(true);
    expect(MathExprHelper.hasLettersOrDigits('a')).toBe(true);
    expect(MathExprHelper.hasLettersOrDigits('1')).toBe(true);
    expect(MathExprHelper.hasLettersOrDigits(symbolsStr)).toBe(false);
    expect(MathExprHelper.hasLettersOrDigits(symbolsStr + 'a')).toBe(true);
    expect(MathExprHelper.hasLettersOrDigits(symbolsStr + '1')).toBe(true);
  });

  test('replaceVariableMarks', () => {
    expect(
      MathExprHelper.replaceVariableMarks('pow({{varX}}) + {{varY}}', [
        '{{',
        '}}',
      ]),
    ).toBe('pow([varX]) + [varY]');
  });

  test('isOperator', () => {
    expect(MathExprHelper.isOperator('+')).toBe(true);
    expect(MathExprHelper.isOperator('+', ['+'])).toBe(false);

    expect(MathExprHelper.isOperator('-')).toBe(true);
    expect(MathExprHelper.isOperator('-', ['-'])).toBe(false);

    expect(MathExprHelper.isOperator('*')).toBe(true);
    expect(MathExprHelper.isOperator('*', ['*'])).toBe(false);

    expect(MathExprHelper.isOperator('/')).toBe(true);
    expect(MathExprHelper.isOperator('/', ['/'])).toBe(false);

    expect(MathExprHelper.isOperator('^')).toBe(true);
    expect(MathExprHelper.isOperator('^', ['^'])).toBe(false);
  });
});
