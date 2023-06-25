/*Functions to perform arithmetic operations*/

const add = function (integer1, integer2) {
  integer1 = integer1 === null ? 0 : integer1;
  integer2 = integer2 === null ? 0 : integer2;
  return integer1 + integer2;
};

const subtract = function (integer1, integer2) {
  integer1 = integer1 === null ? 0 : integer1;
  integer2 = integer2 === null ? 0 : integer2;
  return integer1 - integer2;
};

const multiply = function (integer1, integer2) {
  integer1 = integer1 === null ? 1 : integer1;
  integer2 = integer2 === null ? 1 : integer2;
  return integer1 * integer2;
};

const divide = function (integer1, integer2) {
  if (integer2 === null) {
    integer2 = 1;
  }
  if (integer2 === 0) {
    return "Division by zero, go directly to math jail, do not collect 200$.";
  }
  return integer1 / integer2;
};

const operate = function (operand1, operand2, operator) {
  return convertToFunction(operator)(operand1, operand2);
};

const power = function (base, exponent) {
  if (exponent === null) {
    exponent = 1;
  }

  switch (exponent) {
    case 0:
      return 1;
    default:
      return base * power(base, exponent - 1);
  }
};

const round = function (number, pow) {
  if (pow <= 13) {
    return number;
  }
  return Math.round(number / power(10, pow - 2)) / 10;
};

const priority = function (operator) {
  switch (operator) {
    case "power":
      return 4;

    case "x":
      return 3;

    case "/":
      return 2;

    case "+":
    case "-":
      return 1;
  }
};

/*Functions to deal with expression tree*/

const isANumber = function (expression) {
  return !expression.hasOwnProperty("operator");
};

function createNumber(value = null) {
  return { value: value };
}

const latestNumber = function (expression) {
  if (isANumber(expression)) {
    return expression;
  }
  return latestNumber(expression.secondOperand);
};

function joinExpressions(operator, firstOperand, secondOperand) {
  if (isANumber(firstOperand)) {
    firstOperand.operator = operator;
    firstOperand.firstOperand = { value: firstOperand.value };
    firstOperand.secondOperand = secondOperand;
  } else {
    let tmpExpression = {
      operator: firstOperand.operator,
      value: firstOperand.value,
      firstOperand: firstOperand.firstOperand,
      secondOperand: firstOperand.secondOperand,
    };
    firstOperand.operator = operator;
    firstOperand.firstOperand = tmpExpression;
    firstOperand.secondOperand = secondOperand;
  }
  firstOperand.value = operate(
    firstOperand.firstOperand.value,
    firstOperand.secondOperand.value,
    firstOperand.operator
  );
}

const addDigit = function (node, digit) {
  if (!node.value) {
    node.value = digit;
  } else if (Number.isNaN(node.value)) {
    alert("Node isn't a number");
  } else {
    node.value = 10 * node.value + digit;
  }
};

const addOperator = function (operator, expression) {
  if (
    isANumber(expression) ||
    priority(operator) <= priority(expression.operator)
  ) {
    joinExpressions(operator, expression, createNumber());
  } else {
    addOperator(operator, expression.secondOperand);
    return expression;
  }
};

const updateValues = function (expression) {
  if (!isANumber(expression)) {
    updateValues(expression.secondOperand);
    if (expression.operator === "/" && expression.secondOperand.value === 0) {
      expression.value = operate(
        expression.firstOperand.value,
        1,
        expression.operator
      );
    } else {
      expression.value = operate(
        expression.firstOperand.value,
        expression.secondOperand.value,
        expression.operator
      );
    }
  }
};

const calculateValue = function (expression) {
  if (!isANumber(expression)) {
    if (calculateValue(expression.secondOperand) === "error") {
      return "error";
    }
    if (expression.operator === "/" && expression.secondOperand.value === 0) {
      clearDisplay();
      display.classList.add("small");
      addToDisplay("FATAL ERROR:Division by zero. You go to math jail!");
      return "error";
    } else {
      expression.value = operate(
        expression.firstOperand.value,
        expression.secondOperand.value,
        expression.operator
      );
    }
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
    case "round":
      return round;
  }
};

/*Document variables*/
const mainExpression = document.querySelector(".main-expression");
const numkeys = document.querySelectorAll(".num");
const operatorkeys = document.querySelectorAll(".operator");
const keys = document.querySelectorAll(".key");
const pad = document.querySelector(".pad");
const equal = document.querySelector(".equal");
const clear = document.querySelector(".clear");
const tmpResult = document.querySelector(".tmp-result");
const minusKey = document.querySelector(".minus");
let mainExpressionTree = createNumber();
let parentheses = [mainExpressionTree];
let mainNode = mainExpressionTree;

/*Functions to update the display*/

const updateTmp = function () {
  value = mainExpressionTree.value;
  length = value.toString().length;
  tmpResult.textContent =
    length > 10
      ? (
          Math.round(value / power(10, length - 1)) * power(10, length - 1)
        ).toExponential()
      : value;
};

const clearDisplay = function () {
  mainExpression.classList.remove("small");
  mainExpression.classList.add("big");
  mainExpression.textContent = "";
  tmpResult.textContent = "";
  mainExpressionTree = { value: null };
  parentheses = [mainExpressionTree];
  mainNode = mainExpressionTree;
  activateNumkeys();
  disableOperators();
  forgetParenthesis();
};

const confirmExpression = function () {
  if (calculateValue(mainExpression) !== "error") {
    const value = mainExpressionTree.value;
    const length = value.toString().length;
    mainExpressionTree = {
      value:
        length > 10
          ? Math.round(value / power(10, length - 1)) * power(10, length - 1)
          : value,
    };
    mainExpression.textContent =
      length > 10 ? mainExpressionTree.value.toExponential() : value;

    tmpResult.textContent = "";
    parentheses = [mainExpressionTree];
    mainNode = mainExpressionTree;
    forgetParenthesis();
  }
};

const addToDisplay = function (keyValue) {
  if (keyValue === "x") {
    keyValue = "*";
  }
  mainExpression.textContent += keyValue;
};

const findSpan = function (key) {
  let keySpan = key.firstChild;
  while (keySpan.tagName !== "SPAN") {
    keySpan = keySpan.nextSibling;
  }
  return keySpan;
};

const reactToKeyClick = function (ev) {
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
      disableNumkeys();
      operatorkeys.forEach((key) => {
        key.removeEventListener("click", closeParenthesis, { once: true });
      });
      break;
    case "+":
    case "x":
    case "/":
    case "-":
      addOperator(keySpan.textContent, mainNode);
      disableOperators();
      addToDisplay(keySpan.textContent);
      break;
    case "(":
      openParentheses();
      addToDisplay(keySpan.textContent);
      disableOperators();
    case ")":
      closeParenthesis();
      addToDisplay(keySpan.textContent);
      enableOperators();

    default:
      addDigit(latestNumber(mainNode), Number(keySpan.textContent));
      updateValues(mainExpressionTree);
      updateTmp();
      addToDisplay(keySpan.textContent);
      enableOperators();
  }
};

/*Functions to enable/disable the operators*/
const activateNumkeys = function () {
  numkeys.forEach(function (key) {
    key.addEventListener("click", reactToKeyClick);
    key.addEventListener("mouseover", animateKeys);
  });
};

const disableNumkeys = function () {
  numkeys.forEach(function (key) {
    key.removeEventListener("click", reactToKeyClick);
    key.removeEventListener("mouseover", animateKeys);
  });
  operatorkeys.forEach(function (key) {
    key.addEventListener("click", () => {
      activateNumkeys();
    });
  });
};

const activateMisc = function () {
  clear.addEventListener("click", reactToKeyClick);
  equal.addEventListener("click", reactToKeyClick);
  equal.addEventListener("mouseover", animateKeys);
  clear.addEventListener("mouseover", animateKeys);
};

const enableOperators = function () {
  operatorkeys.forEach(function (key) {
    key.addEventListener("click", reactToKeyClick, { once: true });
    minusKey.removeEventListener("click", handleNegative, { once: true });
    key.addEventListener("mouseover", animateKeys);
  });
};

const disableOperators = function () {
  operatorkeys.forEach(function (key) {
    key.removeEventListener("click", reactToKeyClick, { once: true });
  });
  enableNegative();
};

const enableNegative = function () {
  minusKey.addEventListener("click", handleNegative, { once: true });
  minusKey.addEventListener("mouseover", animateKeys);
};

const handleNegative = function (ev) {
  if (!isANumber(mainNode)) {
    addToDisplay("(-");
    rememberParenthesis();
  } else {
    addToDisplay("-");
  }
  openParentheses();
  addDigit(latestNumber(mainNode), -1);

  addOperator("x", mainNode);
};

const disableNegative = function () {
  minusKey.removeEventListener("click", handleNegative, { once: true });
};

const rememberParenthesis = function () {
  operatorkeys.forEach(function (key) {
    key.addEventListener("click", closeParenthesis, { once: true });
  });
};

const forgetParenthesis = function () {
  operatorkeys.forEach(function (key) {
    key.removeEventListener("click", closeParenthesis, { once: true });
  });
};

const openParentheses = function () {
  length = parentheses.push(latestNumber(mainNode));
  mainNode = parentheses[length - 1];
};

const closeParenthesis = function () {
  addToDisplay(")");
  calculateValue(mainNode);
  if (parentheses.pop() === mainExpressionTree) {
    joinExpressions(null, mainExpressionTree, createNumber());
    parentheses = [mainExpressionTree];
  } else {
    mainNode = parentheses[parentheses.length - 1];
  }
  operatorkeys.forEach(function (key) {
    key.removeEventListener("click", closeParenthesis, { once: true });
  });
};

/*Animations of the keys*/
const findKeyType = function (key) {
  switch (findSpan(key).textContent) {
    case "AC":
      return "clear";
    case "=":
      return "equal";
    case "+":
    case "x":
    case "/":
    case "-":
      return "operator";
    default:
      return "number";
  }
};

const turnAround = function (key, angle, color) {
  key.style.cursor = "pointer";
  angle.value += 1;
  key.style.borderImage = `linear-gradient(${90 + angle.value}deg,${color}) 1`;
};

const stopAnimation = function (key, angle, color) {
  key.style.borderImage = `linear-gradient(90deg,${color}) 1`;
  angle.value = 0;
};

const chooseColor = function (keyType) {
  switch (keyType) {
    case "number":
      return " cyan,midnightblue";
    case "operator":
      return "yellow, orangered";
    case "clear":
      return "indianred,red";
    case "equal":
      return " mediumspringgreen,lime";
  }
};

const animateKeys = function (ev) {
  const key = ev.currentTarget;
  const color = chooseColor(findKeyType(key));
  let angle = { value: null };
  intervalID = setInterval(turnAround, 2, key, angle, color);
  key.addEventListener(
    "mouseout",
    () => {
      clearInterval(intervalID);
      stopAnimation(key, angle, color);
    },
    { once: true }
  );
};

/*Dealing with overflow*/

const popLatestNumber = function () {
  const displayReversed = mainExpression.textContent
    .split("")
    .reverse()
    .join("");
  let number = "";
  for (i of displayReversed) {
    if (Number(i) === "NaN") {
      return number;
    } else {
      number = mainExpression.textContent.pop() + number;
    }
  }
  return number;
};

const doNotOverflow = function (ev) {
  if (
    mainExpression.offsetWidth >
      mainExpression.parentElement.offsetWidth - 25 &&
    mainNode === mainExpressionTree
  ) {
    disableNumkeys();
    disableOperators();
  }
};

numkeys.forEach(function (key) {
  key.addEventListener("click", doNotOverflow);
});

/*Implementation of parentheses*/

/*Initializing the calculator*/
clearDisplay();
activateNumkeys();
activateMisc();
enableNegative();
pad.addEventListener("click", () => {});
