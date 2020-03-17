import { MathExprTokenizer } from '../MathExprTokenizer/index';
import { AST } from '../AST/index';
import {
  Token,
  TokenType,
  AssociativityType,
} from '../MathExprTokenizer/Token';
import {
  MathExprValidator,
  MathExprValidatorError,
} from '../MathExprValidator/index';
import { MathExprHelper } from '../MathExprHelper/index';

type TVariableMap = { [variableName: string]: number };
type TNameToFunctionMap = {
  [functionName: string]: (...args: number[] | string[]) => number;
};
type TNameToArgumentsQuantityMap = { [functionName: string]: number };
export type TVariableMarks = [string, string];

interface IMathExprParserProps {
  variablesMap?: TVariableMap;
  nameToFunctionMap?: TNameToFunctionMap;
  nameToArgumentsQuantityMap?: TNameToArgumentsQuantityMap;
  variableMarks?: TVariableMarks;
}

export class MathExprParser {
  private variablesMap: TVariableMap = {};
  private nameToFunctionMap: TNameToFunctionMap = {};
  private nameToArgumentsQuantityMap: TNameToArgumentsQuantityMap = {};
  // Validator is used to validate input math expressions
  private validator: MathExprValidator = new MathExprValidator();
  // Tokenizer is used to get tokens (lexems) from initial math string
  private tokenizer: MathExprTokenizer = new MathExprTokenizer();
  // Initial tokens (can be used for debugging)
  private initialTokens: Token[] = [];
  // Output queue (tokens in reverse polish notation - RPN)
  private outputQueue: Token[] = [];
  // Operators stack (contains operators & functions)
  private operatorsStack: Token[] = [];
  // Opening and closing marks are used to find variables in math expression
  private variableMarks: TVariableMarks;

  constructor(props: IMathExprParserProps = {}) {
    const {
      nameToFunctionMap = {},
      nameToArgumentsQuantityMap = {},
      variablesMap = {},
      variableMarks = ['[', ']'],
    } = props;

    this.nameToFunctionMap = nameToFunctionMap;
    this.nameToArgumentsQuantityMap = nameToArgumentsQuantityMap;
    this.variablesMap = variablesMap;
    this.variableMarks = variableMarks;
  }

  // Parses math string to RPN using shunting yard algorithm
  parse = (str: string): MathExprParser => {
    this.clearMemory();

    str = MathExprHelper.replaceVariableMarks(str, this.variableMarks);

    const isValid = this.validator.validate(str);

    if (!isValid) {
      return this;
    }

    const tokens = this.tokenizer.tokenize(str).getTokens();
    this.initialTokens = tokens;

    tokens.forEach(token => {
      const { type } = token;

      switch (type) {
        case TokenType.Number:
        case TokenType.Date:
        case TokenType.Variable: {
          this.outputQueue.push(token);
          break;
        }
        case TokenType.LeftParenthesis:
        case TokenType.Function: {
          this.operatorsStack.push(token);
          break;
        }
        case TokenType.FunctionSeparator: {
          while (
            this.getLastOperatorType() !== TokenType.LeftParenthesis &&
            this.operatorsStackIsNotEmpty()
          ) {
            this.popOperatorToOutputQueue();
          }
          if (this.operatorsStackIsEmpty()) {
            this.validator.addError('', -1, 140);
          }
          break;
        }
        case TokenType.Operator: {
          while (
            this.getLastOperator() &&
            this.operatorsStackIsNotEmpty() &&
            ((this.getLastOperator().getAssociativity() ===
              AssociativityType.Left &&
              this.getLastOperator().getPrecedence() >=
                token.getPrecedence()) ||
              (this.getLastOperator().getAssociativity() ===
                AssociativityType.Right &&
                this.getLastOperator().getPrecedence() < token.getPrecedence()))
          ) {
            this.popOperatorToOutputQueue();
          }
          this.operatorsStack.push(token);
          break;
        }
        case TokenType.RightParenthesis: {
          while (
            this.getLastOperatorType() !== TokenType.LeftParenthesis &&
            this.operatorsStackIsNotEmpty()
          ) {
            this.popOperatorToOutputQueue();
          }
          // removes LeftParenthesis from operators stack;
          this.operatorsStack.pop();
          if (this.getLastOperatorType() === TokenType.Function) {
            this.popOperatorToOutputQueue();
          }
          break;
        }
      }
    });

    while (this.operatorsStack.length) {
      this.popOperatorToOutputQueue();
    }

    return this;
  };

  getErrors = (): MathExprValidatorError[] => this.validator.getErrors();

  // Returns reverse polish notation (RPN)
  getRPN = (): Token[] => this.outputQueue;

  evaluate = (): number => {
    const operandsStack: number[] = [];

    this.outputQueue.forEach(token => {
      const { type, value } = token;

      switch (type) {
        case TokenType.Number:
        case TokenType.Date: {
          operandsStack.push(+value);
          break;
        }
        case TokenType.Variable: {
          let variableValue = this.variablesMap[value];
          if (variableValue === undefined) {
            this.validator.addError(
              '',
              -1,
              130,
              `Variable with name "${value}" not found in TVariableMap`,
            );
            variableValue = NaN;
          }
          operandsStack.push(+variableValue);
          break;
        }
        case TokenType.Operator: {
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
            case '^':
              result = Math.pow(leftOperand, rightOperand);
              break;
          }

          operandsStack.push(result);
          break;
        }
        case TokenType.Function: {
          const args: number[] = [];
          const argQuantity = this.nameToArgumentsQuantityMap[value];
          for (let i = 0; i < argQuantity; i++) {
            args.push(operandsStack.pop());
          }
          const func = this.nameToFunctionMap[value];
          if (func) {
            const functionResult = func(...args.reverse());
            operandsStack.push(functionResult);
          } else {
            this.validator.addError(
              '',
              -1,
              120,
              `Function with name "${value}" not found in nameToFunctionMap`,
            );
            operandsStack.push(NaN);
          }
          break;
        }
      }
    });

    // todo: may be print error
    return operandsStack.pop();
  };

  // Returns AST (abstract syntax tree)
  getAST = (): AST => {
    const astItems: AST[] = [];

    this.outputQueue.forEach(token => {
      const { type, value } = token;

      switch (type) {
        case TokenType.Number:
        case TokenType.Date:
        case TokenType.Variable: {
          astItems.push(new AST(token, []));
          break;
        }
        case TokenType.Operator: {
          const rightOperand = astItems.pop();
          const leftOperand = astItems.pop();
          astItems.push(new AST(token, [leftOperand, rightOperand]));
          break;
        }
        case TokenType.Function: {
          const args: AST[] = [];
          let argQuantity = this.nameToArgumentsQuantityMap[value];
          if (argQuantity === undefined) {
            argQuantity = 0;
            this.validator.addError(
              '',
              -1,
              110,
              `Function with name "${value}" not found in nameToArgumentsQuantityMap`,
            );
          }
          // TODO: наверное, можно переделать на splice или slice, чтобы обойтись без цикла
          for (let i = 0; i < argQuantity; i++) {
            args.push(astItems.pop());
          }
          astItems.push(new AST(token, args.reverse()));
          break;
        }
      }
    });

    const finalAst = astItems.pop();
    if (astItems.length) {
      this.validator.addError('', -1, 100);
    }
    return finalAst;
  };

  // Returns initial tokens created by MathExprTokenizer (can be used for debugging)
  getInitialTokens = (): Token[] => this.initialTokens;

  isValid = (): boolean => this.validator.isValid();

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
    this.initialTokens = [];
    this.validator.clearMemory();
  };
}
