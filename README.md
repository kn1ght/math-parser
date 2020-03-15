# math-parser

Parses math expressions using shunting yard algorithm

- works with basic math operators (+, -, \*, /, ^)
- supports any custom functions (should provide map for function arguments quantity and map for functions)
- supports unary minuses
- supports dynamic variables (should provide map for their values)
- supports parenthesis `(2 + 2) * 3`

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

const variablesMap = {
  x: 1,
  y: 2,
};

// provide maps for functions and dynamic variables
const mathExprParser = new MathExprParser({
  nameToFunctionMap,
  nameToArgumentsQuantityMap,
  variablesMap,
});

const mathExpr = 'pow(2, 3) * (max([x], 2) + pow(min(3, 5), [y]))';
mathExprParser.parse(mathExpr); // parses expression
const tokens = mathExprParser.getTokens(); // get tokens (lexems) - this can be used for debugging purposes
const rpn = mathExprParser.getRPN(); // gets RPN presentation of math expression: 2 3 pow x 2 max 3 5 min y pow + *
const ast = mathExprParser.getAST(); // gets AST presentation of math expression
const calculatedExpr = mathExprParser.evaluate(); // evaluates math expression
const errors = mathExprParser.getErrors(); // get array of erros
```

## TODO:

1. Дописать валидатор
   ~~2. Сделать динамические параметры более гибкими (убрать зависимость от квадратных скобок)~~
2. Написать тесты
3. Оформить как npm пакет
4. Поддержка динамического количества параметров у функций?
