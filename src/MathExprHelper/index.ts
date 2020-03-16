import { TVariableMarks } from '../MathExprParser/index';

export class MathExprHelper {
  public static deleteSpaces = (str: string): string => str.replace(/\s/g, '');

  public static replaceUnaryMinus = (str: string): string =>
    str.replace('(-', '(0-').replace(',-', ',0-');

  public static hasLettersOrDigits = (str: string): boolean => {
    for (const ch of str) {
      if (MathExprHelper.isDigit(ch) || MathExprHelper.isLetter(ch)) {
        return true;
      }
    }

    return false;
  };

  // Replaces opening and closing marks for variables, it is needed because MathExprTokenizer uses "[" "]" to find variables
  public static replaceVariableMarks = (
    str: string,
    variableMarks: TVariableMarks,
  ): string => {
    const openingMark = variableMarks[0];
    const closingMark = variableMarks[1];

    if (openingMark === '[' && closingMark === ']') {
      return str;
    }

    if (openingMark === closingMark) {
      throw new Error('Opening and closing marks must be different');
    } else if (openingMark === '' || closingMark === '') {
      throw new Error("Opening and closing marks can't be empty strings");
    } else if (
      MathExprHelper.hasLettersOrDigits(openingMark) ||
      MathExprHelper.hasLettersOrDigits(closingMark)
    ) {
      throw new Error(
        'Opening and closing marks contain letters or digits (must consist only special characters)',
      );
    }

    return str
      .split(openingMark)
      .join('[')
      .split(closingMark)
      .join(']');
  };

  public static isDigit = (ch: string): boolean => /\d/.test(ch);
  public static isLetter = (ch: string): boolean =>
    ch.toLowerCase() !== ch.toUpperCase();
  public static isLeftParenthesis = (ch: string): boolean => ch === '(';
  public static isRightParenthesis = (ch: string): boolean => ch === ')';
  public static isLeftBracket = (ch: string): boolean => ch === '[';
  public static isRightBracket = (ch: string): boolean => ch === ']';
  public static isOneOfLeftBrackets = (ch: string): boolean =>
    ['(', '[', '{'].includes(ch);
  public static isOneOfRightBrackets = (ch: string): boolean =>
    [')', ']', '}'].includes(ch);
  public static isComma = (ch: string): boolean => ch === ',';
  public static isDot = (ch: string): boolean => ch === '.';
  public static isOperator = (
    ch: string,
    operatorsExcludedFromCheck?: string[],
  ): boolean => {
    const operators = ['+', '-', '*', '/', '^'];

    return operatorsExcludedFromCheck
      ? operators
          .filter(operator => !operatorsExcludedFromCheck.includes(operator))
          .includes(ch)
      : operators.includes(ch);
  };
}
