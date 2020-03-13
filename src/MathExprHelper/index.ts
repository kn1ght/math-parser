export class MathExprHelper {
  public static deleteSpaces = (str: string): string => str.replace(/\s/g, '');

  public static replaceUnaryMinus = (str: string): string =>
    str.replace('(-', '(0-').replace(',-', ',0-');

  public static isDigit = (ch: string): boolean => /\d/.test(ch);
  public static isLetter = (ch: string): boolean =>
    ch.toLowerCase() !== ch.toUpperCase();
  public static isOperator = (ch: string): boolean => /\+|-|\*|\/|\^/.test(ch);
  public static isLeftParenthesis = (ch: string): boolean => ch === '(';
  public static isRightParenthesis = (ch: string): boolean => ch === ')';
  public static isLeftBracket = (ch: string): boolean => ch === '[';
  public static isRightBracket = (ch: string): boolean => ch === ']';
  public static isComma = (ch: string): boolean => ch === ',';
  public static isDot = (ch: string): boolean => ch === '.';
}
