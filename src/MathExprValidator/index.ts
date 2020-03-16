import { MathExprHelper } from '../MathExprHelper/index';

const errorMessageByErrorCodeMap: { [code: string]: string } = {
  10: 'Math expression misses closing bracket',
  20: 'Math expression misses opening bracket',
  30: "Math expression can't start with operator",
  40: "Math expression can't end with operator",
  50: "Math expression can't start with comma",
  60: "Math expression can't end with comma",
  70: "Math expression can't start with dot",
  80: "Math expression can't end with dot",
  90: 'Math expression has uncalled function',
  100: 'Not all astItems used,',
  110: 'Function not found in nameToArgumentsQuantityMap',
  120: 'Function not found in nameToFunctionMap',
  130: 'Variable with name "${value}" not found in TVariableMap',
  140: 'Math expression has missing comma or opening parenthesis',
  150: 'Date is empty',
};

abstract class CharInfo {
  ch: string;
  positionAtString: number;

  constructor(ch: string, positionAtString: number) {
    this.ch = ch;
    this.positionAtString = positionAtString;
  }
}

class BracketInfo extends CharInfo {}

export class MathExprValidatorError extends CharInfo {
  errorCode: number;
  message: string;

  constructor(
    ch: string,
    positionAtString: number, // can be -1 if we can't exactly locate error position
    errorCode: number,
    errorMessage?: string,
  ) {
    super(ch, positionAtString);
    this.errorCode = errorCode;
    this.message = errorMessage
      ? errorMessage
      : errorMessageByErrorCodeMap[errorCode];
    console.error(this.message);
  }
}

const leftToRightBracketMap: { [left: string]: string } = {
  '(': ')',
  '[': ']',
  '{': '}',
};

export class MathExprValidator {
  private errors: MathExprValidatorError[] = [];

  private bracketInfosStack: BracketInfo[] = [];

  validate = (str: string): boolean => {
    this.clearMemory();

    str = str.trim();

    for (let index = 0; index < str.length; index++) {
      if (this.errors.length) break;

      const ch = str[index];
      const prevCh = str[index - 1];
      const isFirstCh = index === 0;
      const isLastCh = index === str.length - 1;

      if (MathExprHelper.isOneOfLeftBrackets(ch)) {
        if (isLastCh) {
          this.addError(ch, index, 10);
        } else {
          const bracketInfo = new BracketInfo(ch, index);
          this.bracketInfosStack.push(bracketInfo);
        }
      } else if (MathExprHelper.isOneOfRightBrackets(ch)) {
        const lastBracketValue = this.getLastBracketInfoValue();
        if (leftToRightBracketMap[lastBracketValue] !== ch) {
          this.addError(ch, index, 20);
        } else {
          this.bracketInfosStack.pop();
        }
      } else if (isFirstCh && MathExprHelper.isOperator(ch, ['-'])) {
        this.addError(ch, index, 30);
      } else if (isLastCh && MathExprHelper.isOperator(ch)) {
        this.addError(ch, index, 40);
      } else if (isFirstCh && MathExprHelper.isComma(ch)) {
        this.addError(ch, index, 50);
      } else if (isLastCh && MathExprHelper.isComma(ch)) {
        this.addError(ch, index, 60);
      } else if (isFirstCh && MathExprHelper.isDot(ch)) {
        this.addError(ch, index, 70);
      } else if (isLastCh && MathExprHelper.isDot(ch)) {
        this.addError(ch, index, 80);
      } else if (isLastCh && MathExprHelper.isLetter(ch)) {
        this.addError(ch, index, 90);
      } else if (MathExprHelper.isSharp(ch) && MathExprHelper.isSharp(prevCh)) {
        this.addError(ch, index, 150);
      }
    }

    if (this.bracketInfosStack.length) {
      const bracket = this.bracketInfosStack.pop();
      this.addError(bracket.ch, bracket.positionAtString, 10);
    }

    return !this.errors.length;
  };

  getErrors = (): MathExprValidatorError[] => this.errors;

  addError = (
    ch: string,
    positionAtString: number,
    errorCode: number,
    errorMessage?: string,
  ): void => {
    this.errors.push(
      new MathExprValidatorError(ch, positionAtString, errorCode, errorMessage),
    );
  };

  clearMemory = (): void => {
    this.errors = [];
    this.bracketInfosStack = [];
  };

  isValid = (): boolean => !this.errors.length;

  public static getErrorPositions = (
    errors: MathExprValidatorError[],
  ): number[] => {
    return errors
      .filter(e => e.positionAtString > -1)
      .map(e => e.positionAtString);
  };

  private getLastBracketInfoValue = (): string => {
    const lastBracketInfo = this.bracketInfosStack.slice(-1)[0];
    return lastBracketInfo ? lastBracketInfo.ch : null;
  };
}
