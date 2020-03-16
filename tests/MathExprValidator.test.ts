import { MathExprValidator } from '../src/MathExprValidator/index';

describe('MathExprValidator', () => {
  const mathExprValidator = new MathExprValidator();

  test('validate brackets', () => {
    expect(mathExprValidator.validate('(){}[]')).toBe(true);
    expect(mathExprValidator.validate('(()){{}}[[]]')).toBe(true);
    expect(mathExprValidator.validate('({[]})')).toBe(true);
    expect(mathExprValidator.validate('()(()[]{{[()]}})')).toBe(true);

    expect(mathExprValidator.validate('(')).toBe(false);
    expect(mathExprValidator.validate(')')).toBe(false);
    expect(mathExprValidator.validate('({}[]')).toBe(false);
    expect(mathExprValidator.validate('({}[])[')).toBe(false);
    expect(mathExprValidator.validate('(){[]')).toBe(false);
    expect(mathExprValidator.validate('({[]}')).toBe(false);
    expect(mathExprValidator.validate('()(()[]{{[()]})')).toBe(false);
  });

  test('validate first symbols', () => {
    expect(mathExprValidator.validate('-1+2')).toBe(true);
    expect(mathExprValidator.validate('    - 1 + 2')).toBe(true);

    expect(mathExprValidator.validate('+1+2')).toBe(false);
    expect(mathExprValidator.validate('    + 1 + 2')).toBe(false);
    expect(mathExprValidator.validate('*1+2')).toBe(false);
    expect(mathExprValidator.validate('/1+2')).toBe(false);
    expect(mathExprValidator.validate('^1+2')).toBe(false);
    expect(mathExprValidator.validate('.1+2')).toBe(false);
    expect(mathExprValidator.validate(',1+2')).toBe(false);
  });

  test('validate last symbols', () => {
    expect(mathExprValidator.validate('1+2+')).toBe(false);
    expect(mathExprValidator.validate('1+2+   ')).toBe(false);
    expect(mathExprValidator.validate('1+2-')).toBe(false);
    expect(mathExprValidator.validate('1+2*')).toBe(false);
    expect(mathExprValidator.validate('1+2/')).toBe(false);
    expect(mathExprValidator.validate('1+2^')).toBe(false);
    expect(mathExprValidator.validate('1+2.')).toBe(false);
    expect(mathExprValidator.validate('1+2,')).toBe(false);
  });

  test('validate sharps (#)', () => {
    expect(mathExprValidator.validate('#16/03/2020#')).toBe(true);
    expect(
      mathExprValidator.validate('pow(#16/03/2020#, 2) + #17/03/2020#'),
    ).toBe(true);

    expect(mathExprValidator.validate('##,')).toBe(false);
    expect(mathExprValidator.validate('pow(#16/03/2020#, 2) + ##,')).toBe(
      false,
    );
    expect(mathExprValidator.validate('pow(##, 2) + #16/03/2020#,')).toBe(
      false,
    );
  });
});
