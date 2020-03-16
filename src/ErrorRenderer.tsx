import * as React from 'react';
import {
  MathExprValidatorError,
  MathExprValidator,
} from './MathExprValidator/index';
import { Colored } from './Colored';

interface IErrorRendererProps {
  initialStr: string;
  errors: MathExprValidatorError[];
}

export const ErrorRenderer = ({ initialStr, errors }: IErrorRendererProps) => {
  const errorPositions = MathExprValidator.getErrorPositions(errors);

  return (
    <>
      {initialStr
        .trim()
        .split('')
        .map((ch, index) => (
          <React.Fragment key={index}>
            {errorPositions.includes(index) ? <Colored>{ch}</Colored> : ch}
          </React.Fragment>
        ))}
    </>
  );
};
