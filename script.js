/*Functions to perform arithmetic operations*/

const add = function (integer1, integer2) {
  return integer1 + integer2;
};

const subtract = function (integer1, integer2) {
  return integer1 - integer2;
};

const multiply = function (integer1, integer2) {
  return integer1 * integer2;
};

const divide = function (integer1, integer2) {
  if (integer2 === 0) {
    return "Division by zero, go directly to math jail, do not collect 200$.";
  }
  return integer1 / integer2;
};

const operate = function (operand1, operand2, operator) {
  return operator(operand1, operand2);
};

/*Functions to deal with expression tree*/

const newLeaf = function (value = 0) {
  return {
    value,
  };
};

const isALeaf = function (expression) {
  return expression.operator === undefined;
};

function makeExpression(
  operator,
  firstOperand = newLeaf(),
  secondOperand = newLeaf()
) {
  const expression = {
    operator,
    firstOperand,
    secondOperand,
    value: operate(firstOperand.value, secondOperand.value, operator),
  };
  expression.lastOperatorNode = isALeaf(secondOperand)
    ? expression
    : secondOperand.lastOperatorNode;

  return expression;
}

const addNumber = function (number) {
  if (isALeaf(displayValue)) {
    displayValue.value = 10 * displayValue.value + number;
  } else {
    displayValue.lastOperatorNode.secondOperand.value =
      10 * displayValue.lastOperatorNode.secondOperand.value + number;
    updateValue(displayValue);
    tmpRes.textContent = displayValue.value;
  }
};

const updateValue = function (tree) {
  if (!isALeaf(tree)) {
    updateValue(tree.secondOperand);
    tree.value = operate(
      tree.firstOperand.value,
      tree.secondOperand.value,
      tree.operator
    );
  }
};

const appendOperatorAux = function (expression, operator) {
  switch (isALeaf(expression)) {
    case true:
      expression.firstOperand = newLeaf(expression.value);
      expression.secondOperand = newLeaf();
      expression.lastOperatorNode = expression;
      expression.operator = operator;
      expression.value = operate(
        expression.firstOperand.value,
        expression.secondOperand.value,
        expression.operator
      );
      expression.lastOperatorNode = expression;
      break;
    case false:
      appendOperatorAux(expression.secondOperand, operator);
      expression.lastOperatorNode = expression.secondOperand.lastOperatorNode;
      expression.value = operate(
        expression.firstOperand.value,
        expression.secondOperand.value,
        expression.operator
      );
  }
};

const convertToFunction = function (operatorString) {
  switch (operatorString) {
    case "+":
      return add;
    case "-":
      return subtract;
    case "x":
      return multiply;
    case "/":
      return divide;
  }
};

const appendOperator = function (operatorString) {
  const operator = convertToFunction(operatorString);
  switch (operatorString) {
    case "-":
    case "+":
      displayValue = makeExpression(operator, displayValue);
      break;
    case "x":
      appendOperatorAux(displayValue, operator);
      break;
    case "/":
      if (
        isALeaf(displayValue) ||
        !(displayValue.lastOperatorNode.operator(2, 3) === 6)
      ) {
        appendOperatorAux(displayValue, operator);
      } else {
        displayValue.lastOperatorNode.firstOperand =
          displayValue.lastOperatorNode;
        displayValue.lastOperatorNode.secondOperand = newLeaf();
        displayValue.lastOperatorNode.operator = operator;
        updateValue;
      }
  }
};

/*Document variables*/
const display = document.querySelector(".calcul");
const numkeys = document.querySelectorAll(".num");
const operatorkeys = document.querySelectorAll(".operator");
const keys = document.querySelectorAll(".key");
const pad = document.querySelector(".pad");
const equal = document.querySelector(".equal");
const clear = document.querySelector(".clear");
const tmpRes = document.querySelector(".res");
const minusKey = document.querySelector(".minus");
/*Functions to update the display*/

const activateNumkeys = function () {
  numkeys.forEach(function (key) {
    key.addEventListener("click", reactToKeyPress);
  });
};

const activateMisc = function () {
  clear.addEventListener("click", clearDisplay);
  equal.addEventListener("click", confirmExpression);
};

const enableOperators = function () {
  operatorkeys.forEach(function (key) {
    key.addEventListener("click", reactToKeyPress, { once: true });
  });
  minusKey.removeEventListener("click", handleNegative);
};

const disableOperators = function () {
  operatorkeys.forEach(function (key) {
    key.removeEventListener("click", reactToKeyPress, { once: true });
  });
  minusKey.addEventListener("click", handleNegative, { once: true });
};

const enableNegative = function () {
  minusKey.addEventListener("click", handleNegative, { once: true });
};

const handleNegative = function (ev) {
  appendOperator("x");
  displayValue.lastOperatorNode.firstOperand.value = -1;
  if (!isALeaf(displayValue)) {
    addToDisplay("(-");
    rememberParenthesis();
  } else {
    addToDisplay("-");
  }
};

const rememberParenthesis = function () {
  operatorkeys.forEach(function (key) {
    key.addEventListener("click", closeParenthesis);
  });
};

const closeParenthesis = function () {
  addToDisplay(")");
  operatorkeys.forEach(function (key) {
    key.removeEventListener("click", closeParenthesis);
  });
};

const clearDisplay = function () {
  display.textContent = "";
  tmpRes.textContent = "";
  displayValue = newLeaf();
};

const confirmExpression = function () {
  display.textContent = displayValue.value;
  displayValue = newLeaf(displayValue.value);
  tmpRes.textContent = "";
};

const addToDisplay = function (keyValue) {
  if (keyValue === "x") {
    keyValue = "*";
  }
  display.textContent += keyValue;
};

const findSpan = function (key) {
  let keySpan = key.firstChild;
  while (keySpan.tagName !== "SPAN") {
    keySpan = keySpan.nextSibling;
  }
  return keySpan;
};

const updateExpression = function (keyValue, type) {
  switch (type) {
    case "operator":
      appendOperator(keyValue);
      break;
    case "number":
      addNumber(Number(keyValue));
  }
};

const reactToKeyPress = function (ev) {
  const key = ev.currentTarget;
  let keySpan = findSpan(key);

  switch (keySpan.textContent) {
    case "AC":
      clearDisplay();
      disableOperators();
      break;
    case "=":
      confirmExpression();
      enableOperators();
      break;
    case "+":
    case "x":
    case "/":
    case "-":
      updateExpression(keySpan.textContent, "operator");
      disableOperators();
      addToDisplay(keySpan.textContent);
      break;
    default:
      updateExpression(keySpan.textContent, "number");
      addToDisplay(keySpan.textContent);
      enableOperators();
  }
};

/*Script to make the calculator work*/

let displayValue = newLeaf();

activateNumkeys();
activateMisc();
