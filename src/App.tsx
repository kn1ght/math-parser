import * as React from 'react';
import { ASTRenderer } from './ASTRenderer';
import { MathExprParser } from './MathExprParser/index';
import { MathExprValidator } from './MathExprValidator/index';

const nameToFunctionMap = {
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
};

const nameToArgumentsQuantityMap = {
  max: 2,
  min: 2,
  pow: 2,
};

const dParameterMap = {
  dp1: 1,
  dp2: 2,
};

export const App = () => {
  const [mathExpr, setMathExpr] = React.useState<string>(
    'pow(2, 3) * (max([dp1], 2) + pow(min(3, 5), [dp2]))',
  );

  const handleSetMathExpr = React.useCallback(
    e => setMathExpr(e.target.value),
    [],
  );

  const mathExprValidator = new MathExprValidator();
  const isValid = mathExprValidator.validate(mathExpr);
  console.log('validator', isValid, mathExprValidator.getErrors());

  const mathExprParser = new MathExprParser({
    dParameterMap,
    nameToArgumentsQuantityMap,
    nameToFunctionMap,
  });

  mathExprParser.parse(mathExpr);
  const tokens = mathExprParser.getTokens();
  const rpn = mathExprParser.getRPN();
  const ast = mathExprParser.getAST();
  const calculatedExpr = mathExprParser.evaluate();
  const errors = mathExprParser.getErrors();

  console.log('mathExpr', mathExpr);
  console.log('tokens', tokens);
  console.log('rpn', rpn);
  console.log('ast', ast);
  console.log('calculatedExpr', calculatedExpr);
  console.log('errors', errors);

  return (
    <div className="app-container">
      <h1>Math Expression Parser</h1>
      <table>
        <tbody>
          <tr>
            <td>Input expr:</td>
            <td>
              <input
                type="text"
                onChange={handleSetMathExpr}
                value={mathExpr}
                className="math-expr-input"
              />
            </td>
          </tr>
          <tr>
            <td>Tokens:</td>
            <td>
              {tokens.map((t, index) => (
                <React.Fragment key={index}>
                  <span key={index} title={t.type} className="token-wrapper">
                    {t.value}
                  </span>
                  &nbsp;&nbsp;&nbsp;
                </React.Fragment>
              ))}
            </td>
          </tr>
          <tr>
            <td>RPN:</td>
            <td>{rpn}</td>
          </tr>
          <tr>
            <td>AST (rendered as HTML):</td>
            <td>
              <ASTRenderer ast={ast} />
            </td>
          </tr>
          <tr>
            <td>Calculated expr:</td>
            <td>{String(calculatedExpr)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
