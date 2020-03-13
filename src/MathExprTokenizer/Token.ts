export enum TokenType {
  Number = 'number',
  DParameter = 'dParameter',
  FunctionSeparator = 'functionSeparator',
  Function = 'function',
  LeftParenthesis = 'leftParenthesis',
  RightParenthesis = 'rightParenthesis',
  Operator = 'operator',
}

const precedenceByOperatorMap: { [key: string]: number } = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  getPrecedence = (): number => precedenceByOperatorMap[this.value];
}
