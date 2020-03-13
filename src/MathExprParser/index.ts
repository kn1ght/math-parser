import { MathExprTokenizer } from '../MathExprTokenizer/index';
import { AST } from '../AST/index';
import { Token, TokenType } from '../MathExprTokenizer/Token';

type TDParameterMap = { [dParameterName: string]: number };
type TNameToFunctionMap = {
  [functionName: string]: (...args: number[]) => number;
};
type TNameToArgumentsQuantityMap = { [dParameterName: string]: number };

interface IParseMaps {
  dParameterMap?: TDParameterMap;
  nameToFunctionMap?: TNameToFunctionMap;
  nameToArgumentsQuantityMap?: TNameToArgumentsQuantityMap;
}

export class MathExprParser {
  private dParameterMap: TDParameterMap = {};
  private nameToFunctionMap: TNameToFunctionMap = {};
  private nameToArgumentsQuantityMap: TNameToArgumentsQuantityMap = {};
  // Tokenizer is used to get tokens (lexems) from initial math string
  private tokenizer: MathExprTokenizer = new MathExprTokenizer();
  private errors: string[] = [];
  // Initial tokens (can be used for debugging)
  private initialTokens: Token[] = [];
  // Output queue (tokens in reverse polish notation - RPN)
  private outputQueue: Token[] = [];
  // Operators stack (contains operators & functions)
  private operatorsStack: Token[] = [];

  constructor({
    nameToFunctionMap = {},
    nameToArgumentsQuantityMap = {},
    dParameterMap = {},
  }: IParseMaps) {
    this.nameToFunctionMap = nameToFunctionMap;
    this.nameToArgumentsQuantityMap = nameToArgumentsQuantityMap;
    this.dParameterMap = dParameterMap;
  }

  // Parses math string to RPN using shunting yard algorithm
  parse = (str: string): MathExprParser => {
    this.clearMemory();

    const tokens = this.tokenizer.tokenize(str).getTokens();
    this.initialTokens = tokens;

    tokens.forEach(token => {
      const { type } = token;

      if (type === TokenType.Number || type === TokenType.DParameter) {
        this.outputQueue.push(token);
      } else if (type === TokenType.Function) {
        this.operatorsStack.push(token);
      } else if (type === TokenType.FunctionSeparator) {
        while (
          this.getLastOperatorType() !== TokenType.LeftParenthesis &&
          this.operatorsStackIsNotEmpty()
        ) {
          this.popOperatorToOutputQueue();
        }
        if (this.operatorsStack.length === 0) {
          this.addError(
            'Math expression has missing comma or opening parenthesis',
          );
        }
      } else if (type === TokenType.Operator) {
        while (
          this.getLastOperator() &&
          this.getLastOperator().getPrecedence() >= token.getPrecedence() &&
          this.operatorsStackIsNotEmpty()
        ) {
          this.popOperatorToOutputQueue();
        }
        this.operatorsStack.push(token);
      } else if (type === TokenType.LeftParenthesis) {
        this.operatorsStack.push(token);
      } else if (type === TokenType.RightParenthesis) {
        while (
          this.getLastOperatorType() !== TokenType.LeftParenthesis &&
          this.operatorsStackIsNotEmpty()
        ) {
          this.popOperatorToOutputQueue();
        }
        if (this.operatorsStackIsEmpty()) {
          this.addError('Math expression has missing parenthesises');
        }
        // removes LeftParenthesis from operators stack;
        this.operatorsStack.pop();
        if (this.getLastOperatorType() === TokenType.Function) {
          this.popOperatorToOutputQueue();
        }
      }
    });

    while (this.operatorsStack.length) {
      if (this.getLastOperatorType() === TokenType.LeftParenthesis) {
        this.addError('Math expression has unclosed parenthesis');
      }
      this.popOperatorToOutputQueue();
    }

    return this;
  };

  getErrors = (): string[] => this.errors;

  // Returns reverse polish notation (RPN) as string
  getRPN = (): string => this.outputQueue.map(i => i.value).join(' ');

  evaluate = (): number => {
    const operandsStack: number[] = [];

    this.outputQueue.forEach(token => {
      const { type, value } = token;
      if (type === TokenType.Number) {
        operandsStack.push(+value);
      } else if (type === TokenType.DParameter) {
        let dParameterValue = this.dParameterMap[value];
        if (dParameterValue === undefined) {
          this.addError(
            `DParameter with name "${value}" not found in dParameterMap`,
          );
          dParameterValue = NaN;
        }
        operandsStack.push(+dParameterValue);
      } else if (type === TokenType.Operator) {
        const rightOperand = operandsStack.pop();
        const leftOperand = operandsStack.pop();
        let result: number = 0;

        switch (value) {
          case '+':
            result = leftOperand + rightOperand;
            break;
          case '-':
            result = leftOperand - rightOperand;
            break;
          case '*':
            result = leftOperand * rightOperand;
            break;
          case '/':
            result = leftOperand / rightOperand;
            break;
        }

        operandsStack.push(result);
      } else if (type === TokenType.Function) {
        const args: number[] = [];
        const argQuantity = this.nameToArgumentsQuantityMap[value];
        for (let i = 0; i < argQuantity; i++) {
          args.push(operandsStack.pop());
        }
        const func = this.nameToFunctionMap[value];
        if (func) {
          const functionResult = this.nameToFunctionMap[value](
            ...args.reverse(),
          );
          operandsStack.push(functionResult);
        } else {
          this.addError(
            `Function with name "${value}" not found in nameToFunctionMap`,
          );
          operandsStack.push(NaN);
        }
      }
    });

    return operandsStack.pop();
  };

  // Returns AST (abstract syntax tree)
  getAST = (): AST => {
    const astItems: AST[] = [];

    this.outputQueue.forEach(token => {
      const { type, value } = token;
      if (type === TokenType.Number || type === TokenType.DParameter) {
        astItems.push(new AST(token, []));
      } else if (type === TokenType.Operator) {
        const rightOperand = astItems.pop();
        const leftOperand = astItems.pop();
        astItems.push(new AST(token, [leftOperand, rightOperand]));
      } else if (type === TokenType.Function) {
        const args: AST[] = [];
        let argQuantity = this.nameToArgumentsQuantityMap[value];
        if (argQuantity === undefined) {
          argQuantity = 0;
          this.addError(
            `Function with name "${value}" not found in nameToArgumentsQuantityMap`,
          );
        }
        for (let i = 0; i < argQuantity; i++) {
          args.push(astItems.pop());
        }
        astItems.push(new AST(token, args.reverse()));
      }
    });

    const finalAst = astItems.pop();
    if (astItems.length) {
      this.addError('Not all astItems used');
    }
    return finalAst;
  };

  // Returns initial tokens created by MathExprTokenizer (can be used for debugging)
  getTokens = (): Token[] => this.initialTokens;

  private getLastOperator = (): Token => this.operatorsStack.slice(-1)[0];

  private getLastOperatorType = (): TokenType => {
    const lastOperatorInStack = this.operatorsStack.slice(-1)[0];
    return lastOperatorInStack ? lastOperatorInStack.type : null;
  };

  private popOperatorToOutputQueue = (): void => {
    const lastOperatorInStack = this.operatorsStack.pop();
    this.outputQueue.push(lastOperatorInStack);
  };

  private operatorsStackIsEmpty = (): boolean =>
    this.operatorsStack.length === 0;

  private operatorsStackIsNotEmpty = (): boolean =>
    this.operatorsStack.length !== 0;

  private clearMemory = (): void => {
    this.outputQueue = [];
    this.operatorsStack = [];
    this.errors = [];
    this.initialTokens = [];
  };

  private addError = (err: string): void => {
    this.errors.push(err);
    console.error(err);
  };
}
