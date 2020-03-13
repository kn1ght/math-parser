abstract class CharInfo {
  value: string;
  positionAtString: number;

  constructor(value: string, positionAtString: number) {
    this.value = value;
    this.positionAtString = positionAtString;
  }
}

class BracketInfo extends CharInfo {}

class MathExprValidatorError extends CharInfo {
  message: string;

  constructor(value: string, positionAtString: number, message: string) {
    super(value, positionAtString);
    this.message = message;
    console.error(message);
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

    for (let index = 0; index < str.length; index++) {
      if (this.errors.length) break;

      const ch = str[index];
      const isFirstCh = index === 0;
      const isLastCh = index === str.length - 1;

      if (this.isLeftBracket(ch)) {
        if (isLastCh) {
          this.errors.push(
            new MathExprValidatorError(
              ch,
              index,
              'Math expr misses closing bracket',
            ),
          );
        } else {
          const bracketInfo = new BracketInfo(ch, index);
          this.bracketInfosStack.push(bracketInfo);
        }
      } else if (this.isRightBracket(ch)) {
        const lastBracketValue = this.getLastBracketInfoValue();
        if (leftToRightBracketMap[lastBracketValue] !== ch) {
          this.errors.push(
            new MathExprValidatorError(
              ch,
              index,
              'Math expr misses opening bracket',
            ),
          );
        } else {
          this.bracketInfosStack.pop();
        }
      }
    }

    return !this.errors.length;
  };

  getErrors = (): MathExprValidatorError[] => this.errors;

  private getLastBracketInfoValue = (): string => {
    const lastBracketInfo = this.bracketInfosStack.slice(-1)[0];
    return lastBracketInfo ? lastBracketInfo.value : null;
  };

  private isLeftBracket = (ch: string): boolean => ['(', '[', '{'].includes(ch);
  private isRightBracket = (ch: string): boolean =>
    [')', ']', '}'].includes(ch);

  private clearMemory = (): void => {
    this.errors = [];
    this.bracketInfosStack = [];
  };
}
