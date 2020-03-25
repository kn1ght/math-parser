export enum TokenType {
  Number = 'number',
  Variable = 'variable',
  FunctionSeparator = 'functionSeparator',
  Function = 'function',
  LeftParenthesis = 'leftParenthesis',
  RightParenthesis = 'rightParenthesis',
  Operator = 'operator',
  Date = 'date',
}

export enum AssociativityType {
  Left = 'left',
  Right = 'right',
}

const precedenceByOperatorMap: { [key: string]: number } = {
  '|': 8,
  '^': 9,
  '&': 10,
  '>': 12,
  '<': 12,
  '<<': 13,
  '>>': 13,
  '>>>': 13,
  '+': 14,
  '-': 14,
  '*': 15,
  '/': 15,
  '%': 15,
  '**': 16,
};

const associativityByOperatorMap: { [key: string]: AssociativityType } = {
  '|': AssociativityType.Left,
  '^': AssociativityType.Left,
  '&': AssociativityType.Left,
  '>': AssociativityType.Left,
  '<': AssociativityType.Left,
  '<<': AssociativityType.Left,
  '>>': AssociativityType.Left,
  '>>>': AssociativityType.Left,
  '+': AssociativityType.Left,
  '-': AssociativityType.Left,
  '*': AssociativityType.Left,
  '/': AssociativityType.Left,
  '%': AssociativityType.Left,
  '**': AssociativityType.Right,
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
