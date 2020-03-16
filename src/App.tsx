import * as React from 'react';
import { ASTRenderer } from './ASTRenderer';
import { MathExprParser } from './MathExprParser/index';
import { ErrorRenderer } from './ErrorRenderer';

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

const variablesMap = {
  x: 1,
  y: 2,
  z: 3,
};

export const App = () => {
  const [mathExpr, setMathExpr] = React.useState<string>(
    'pow({y}, 3) * (max({x}, 2) + pow(min({z}, 5), {y}))',
  );

  const handleSetMathExpr = React.useCallback(
    e => setMathExpr(e.target.value),
    [],
  );

  const mathExprParser = new MathExprParser({
    variablesMap,
    nameToArgumentsQuantityMap,
    nameToFunctionMap,
    variableMarks: ['{', '}'],
  });

  mathExprParser.parse(mathExpr);
  const tokens = mathExprParser.getInitialTokens();
  const rpn = mathExprParser.getRPN();
  const ast = mathExprParser.getAST();
  const calculatedExpr = mathExprParser.evaluate();
  const errors = mathExprParser.getErrors();
  const isValid = mathExprParser.isValid();

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
            <td>{rpn.map(t => t.value).join(' ')}</td>
          </tr>
          <tr>
            <td>AST (rendered as HTML):</td>
            <td>
              {isValid ? (
                <ASTRenderer ast={ast} />
              ) : (
                <ErrorRenderer errors={errors} initialStr={mathExpr} />
              )}
            </td>
          </tr>
          <tr>
            <td>Calculated expr:</td>
            <td>{String(calculatedExpr)}</td>
          </tr>
          {errors && !!errors.length && (
            <tr>
              <td>Errors:</td>
              <td>
                {errors.map((e, index) => (
                  <div key={index}>{e.message}</div>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
