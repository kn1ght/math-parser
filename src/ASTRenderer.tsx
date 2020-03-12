import * as React from 'react';
import { AST } from './AST/index';
import { TokenType } from './MathExprTokenizer/index';
import { Colored } from './Colored';

interface IASTRendererProps {
  ast: AST;
  parentPrecedence?: number;
}

export const ASTRenderer = ({
  ast,
  parentPrecedence = 0,
}: IASTRendererProps) => {
  if (!ast) {
    return null;
  }

  const { token, operands } = ast;
  const { type, value } = token;
  const currentPrecedence = token.getPrecedence();
  let resultNode;

  if (type === TokenType.Number) {
    return <>{value}</>;
  } else if (type === TokenType.DParameter) {
    return <Colored color="green">[{value}]</Colored>;
  } else if (type === TokenType.Operator) {
    resultNode = (
      <>
        <ASTRenderer ast={operands[0]} parentPrecedence={currentPrecedence} />{' '}
        {value}{' '}
        <ASTRenderer ast={operands[1]} parentPrecedence={currentPrecedence} />
      </>
    );
  } else if (type === TokenType.Function) {
    const args = operands.map((operand, index) => (
      <React.Fragment key={index}>
        {index !== 0 && ', '}
        <ASTRenderer ast={operand} />
      </React.Fragment>
    ));

    resultNode = (
      <>
        <Colored>{value}</Colored>({args})
      </>
    );
  }

  return parentPrecedence > currentPrecedence ? (
    <>
      <Colored color="blue">
        <b>(</b>
      </Colored>
      {resultNode}
      <Colored color="blue">
        <b>)</b>
      </Colored>
    </>
  ) : (
    resultNode
  );
};
