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
  if (!isALeaf(secondOperand)) {
    expression.lastOperatorNode =
      secondOperand.lastOperatorNode === undefined
        ? secondOperand
        : secondOperand.lastOperatorNode;
  }
  return expression;
}

const appendOperatorBottom = function (expression, operator) {
  switch (isALeaf(expression)) {
    case true:
      expression = makeTree(operator, expression);
      break;
    case false:
      appendOperatorBottom(expression.secondOperand, operator);
      expression.lastOperatorNode = secondOperand.lastOperatorNode;
      expression.value = operate(
        expression.firstOperand.value,
        expression.secondOperand.value,
        expression.operator
      );
  }
};

const appendOperator = function (position, operator) {
  switch (position) {
    case "top":
      displayValue = makeExpression(operator, displayValue);
      break;
    case "bottom":
      appendOperatorBottom(displayValue, operator);
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

/*Functions to update the display*/

const reactToKeyPress = function (ev) {
  const key = ev.currentTarget;
  let keyType;
  if (key.classList.contains("num")) {
    keyType = "num";
  } else if (key.classList.contains("operator")) {
    keyType = "operator";
  } else if (key.classList.contains("clear")) {
    keyType = "clear";
  } else if (key.classList.contains("equal")) {
    keyType = "equal";
  }
  switch (keyType) {
    case "clear":
      clearDisplay();
      waitForInput();
      break;
    case "equal":
      confirmExpression();
      waitForInput();
      break;
    case "operator":
      //determineOperatorType(key);
      waitForInput("butOperator");
    //addToDisplay(key.firstChild.textContent);
    default:
      //updateExpression(keyValue);
      display.textContent += key.firstChild.textContent;
  }
};

const waitForInput = function (keytype = "all") {
  switch (keytype) {
    case "all":
      keys.forEach(function (key) {
        key.addEventListener("click", reactToKeyPress);
      });
    case "butOperator":
      numkeys.forEach(function (key) {
        key.addEventListener("click", reactToKeyPress);
      });
      clear.addEventListener("click", reactToKeyPress);
      equal.addEventListener("click", reactToKeyPress);
  }
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

/*Script to make the calculator work*/

let displayValue = newLeaf();
let currentLeaf = displayValue;

waitForInput();
