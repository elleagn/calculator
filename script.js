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

function makeExpression(
  operator,
  firstOperand = newLeaf(),
  secondOperand = newLeaf()
) {
  return {
    operator,
    firstOperand,
    secondOperand,
    value: operate(firstOperand.value, secondOperand.value, operator),
  };
}

const appendOperatorBottom = function (tree, operator) {
  switch (tree.operator) {
    case undefined:
      tree = makeExpression(operator, tree);
      break;
    default:
      appendOperatorBottom(tree.secondOperand, operator);
      tree.value = operate(
        tree.firstOperand.value,
        tree.secondOperand.value,
        tree.operator
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
const equal = document.querySelector(".equal");
const clear = document.querySelector(".clear");
const tmpRes = document.querySelector(".res");

/*Functions to update the display*/

const addToDisplay = function (key) {
  display.textContent += key.firstChild.textContent;
};

const clearDisplay = function () {
  display.textContent = "";
};

let displayValue = newLeaf();
updateDisplay();

numkeys.forEach(function (key) {
  key.addEventListener("click", function (ev) {
    addToDisplay(ev.currentTarget);
  });
});

clear.addEventListener("click", clearDisplay);

equal.addEventListener("click", () => {
  display.textContent = tmpRes.textContent;
  tmpRes.textContent = "";
});

let displayValue = newLeaf();
updateDisplay();
