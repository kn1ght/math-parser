# math-parser

Parses math expressions using shunting yard algorithm

- works with basic math operators (+, -, \*, /, %)
- supports any custom functions (should provide map for function arguments quantity and map for functions)
- supports unary minuses
- supports dynamic variables (should provide map for their values)
- supports parenthesis `(2 + 2) * 3`

### Math-parser can:

1. evaluate math expressions
2. convert math expressions to reverse polish notation (RPN)
3. convert math expressions to abstract syntax tree (AST)

### Usage example:

```
npm i @kn1ght/math-parser
```

```javascript
import { MathExprParser } from '@kn1ght/math-parser';

// provide map of function names to function implementations (if you want to use your functions)
const nameToFunctionMap = {
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
};

// provide map of functions names to function argument quantity (if you want to use your functions)
const nameToArgumentsQuantityMap = {
  pow: 2,
  min: 2,
  max: 2,
};

// provide map of vaiable names to their values (if you want to use variables)
const variablesMap = {
  x: 1,
  y: 2,
};

// initialize parser by creating an instance of MathExprParser
const mathExprParser = new MathExprParser({
  nameToFunctionMap,
  nameToArgumentsQuantityMap,
  variablesMap,
});

// parses imput string expression
mathExprParser.parse('pow(2, 3) * (max([x], 2) + pow(min(3, 5), [y]))');
// get tokens (lexems) - this can be used for debugging purposes
const tokens = mathExprParser.getTokens();
// gets RPN presentation of math expression: 2 3 pow x 2 max 3 5 min y pow + *
const rpn = mathExprParser.getRPN();
// gets AST presentation of math expression
const ast = mathExprParser.getAST();
// evaluates math expression
const calculatedExpr = mathExprParser.evaluate();
// get array of errors
const errors = mathExprParser.getErrors();
```

## TODO:

1. Support dynamic parameters for functions?
2. Unary operators
3. Bitwise operators
4. Relational operators
5. Support of boolean tokens?
