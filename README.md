# math-parser

Parses math expressions using shunting yard algorithm

- works with basic math operators (+, -, \*, /)
- supports any custom functions (should provide map for function arguments quantity and map for functions)
- supports unary minuses
- supports dynamic parameters (should provide map for their values)

### Math-parser can:

1. evaluate math expressions
2. convert math expressions to reverse polish notation (RPN)
3. convert math expressions to abstract syntax tree (AST)

### Usage example:

```javascript
const nameToFunctionMap = {
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
};

const nameToArgumentsQuantityMap = {
  pow: 2,
  min: 2,
  max: 2,
};

const dParameterMap = {
  'c.test1': 1,
  'c.test2': 2,
};

// provide maps for functions and dynamic parameters
const mathExprParser = new MathExprParser({
  nameToFunctionMap,
  nameToArgumentsQuantityMap,
  dParameterMap,
});

const mathExpr = 'pow(2, 3) * (max([c.test1], 2) + pow(min(3, 5), [c.test2]))';
mathExprParser.parse(mathExpr); // parses expression
const tokens = mathExprParser.getTokens(); // get tokens (lexems) - this can be used for debugging purposes
const rpn = mathExprParser.getRPN(); // gets RPN presentation of math expression
const ast = mathExprParser.getAST(); // gets AST presentation of math expression
const calculatedExpr = mathExprParser.evaluate(); // evaluates math expression
const errors = mathExprParser.getErrors(); // get array of erros
```
