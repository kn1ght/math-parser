export enum TokenType {
  Number = 'number',
  Variable = 'variable',
  FunctionSeparator = 'functionSeparator',
  Function = 'function',
  LeftParenthesis = 'leftParenthesis',
  RightParenthesis = 'rightParenthesis',
  Operator = 'operator',
}

export enum AssociativityType {
  Left = 'left',
  Right = 'right',
}

const precedenceByOperatorMap: { [key: string]: number } = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const associativityByOperatorMap: { [key: string]: AssociativityType } = {
  '+': AssociativityType.Left,
  '-': AssociativityType.Left,
  '*': AssociativityType.Left,
  '/': AssociativityType.Left,
  '^': AssociativityType.Right,
};

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  getPrecedence = (): number => precedenceByOperatorMap[this.value];

  getAssociativity = (): AssociativityType =>
    associativityByOperatorMap[this.value];
}
