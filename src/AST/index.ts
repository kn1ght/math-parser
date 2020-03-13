import { Token } from '../MathExprTokenizer/Token';

export class AST {
  token: Token;
  operands: AST[];

  constructor(token: Token, operands: AST[]) {
    this.token = token;
    this.operands = operands;
  }
}
