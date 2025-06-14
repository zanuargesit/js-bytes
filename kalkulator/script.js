const kalkulator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  expression: "",
  lastActionEquals: false,
};

function updateDisplay() {
  const display = document.querySelector(".kalkulator-display");
  if (kalkulator.expression) {
    display.textContent = kalkulator.expression;
  } else {
    display.textContent = kalkulator.displayValue;
  }
}

function inputDigit(digit) {
  if (kalkulator.lastActionEquals) {
    kalkulator.displayValue = digit;
    kalkulator.expression = "";
    kalkulator.firstOperand = null;
    kalkulator.operator = null;
    kalkulator.waitingForSecondOperand = false;
    kalkulator.lastActionEquals = false;
    updateDisplay();
    return;
  }

  const { displayValue, waitingForSecondOperand, expression, operator } =
    kalkulator;

  if (waitingForSecondOperand) {
    kalkulator.displayValue = digit;
    if (operator) {
      const lastOperandRegex = /(\d*\.?\d+)$/;
      kalkulator.expression = expression.replace(lastOperandRegex, digit);
    } else {
      kalkulator.expression = digit;
    }
    kalkulator.waitingForSecondOperand = false;
  } else {
    kalkulator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
    if (expression === "0" && digit !== "0") {
      kalkulator.expression = digit;
    } else if (expression === "" || (expression === "0" && digit === "0")) {
      kalkulator.expression = kalkulator.displayValue;
    } else {
      const lastOperandRegex = /(\d*\.?\d+)$/;
      if (lastOperandRegex.test(expression)) {
        kalkulator.expression = expression.replace(
          lastOperandRegex,
          kalkulator.displayValue
        );
      } else {
        kalkulator.expression += digit;
      }
    }
  }
  updateDisplay();
}

function inputDecimal(dot) {
  if (kalkulator.lastActionEquals) {
    kalkulator.displayValue = "0.";
    kalkulator.expression = "";
    kalkulator.firstOperand = null;
    kalkulator.operator = null;
    kalkulator.waitingForSecondOperand = false;
    kalkulator.lastActionEquals = false;
    updateDisplay();
    return;
  }

  if (kalkulator.waitingForSecondOperand) {
    kalkulator.displayValue = "0.";
    if (kalkulator.operator) {
      const lastOperandRegex = /(\d*\.?\d+)$/;
      kalkulator.expression = kalkulator.expression.replace(
        lastOperandRegex,
        "0."
      );
    } else {
      kalkulator.expression = "0.";
    }
    kalkulator.waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!kalkulator.displayValue.includes(dot)) {
    kalkulator.displayValue += dot;
    kalkulator.expression += dot;
  }
  updateDisplay();
}

function handleOperator(nextOperator) {
  if (kalkulator.lastActionEquals) {
    kalkulator.expression = kalkulator.displayValue + " " + nextOperator;
    kalkulator.firstOperand = parseFloat(kalkulator.displayValue);
    kalkulator.operator = nextOperator;
    kalkulator.waitingForSecondOperand = true;
    kalkulator.lastActionEquals = false;
    updateDisplay();
    return;
  }

  const { firstOperand, displayValue, operator, expression } = kalkulator;
  const inputValue = parseFloat(displayValue);

  if (nextOperator === "√" || nextOperator === "%") {
    const result = calculate(inputValue, null, nextOperator);
    kalkulator.displayValue = `${parseFloat(result.toFixed(7))}`;
    kalkulator.firstOperand = result;
    kalkulator.waitingForSecondOperand = true;
    kalkulator.operator = null;
    kalkulator.expression =
      nextOperator === "√"
        ? `√(${displayValue})`
        : `${displayValue}${nextOperator}`;
    updateDisplay();
    return;
  }

  if (operator && kalkulator.waitingForSecondOperand) {
    kalkulator.operator = nextOperator;
    kalkulator.expression = expression.replace(/.$/, nextOperator);
    updateDisplay();
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    kalkulator.firstOperand = inputValue;
    kalkulator.expression = `${inputValue} ${nextOperator}`;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    kalkulator.displayValue = `${parseFloat(result.toFixed(7))}`;
    kalkulator.firstOperand = result;
    kalkulator.expression = `${parseFloat(result.toFixed(7))} ${nextOperator}`;
  }

  kalkulator.waitingForSecondOperand = true;
  kalkulator.operator = nextOperator;
  updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === "+") {
    return firstOperand + secondOperand;
  } else if (operator === "-") {
    return firstOperand - secondOperand;
  } else if (operator === "*") {
    return firstOperand * secondOperand;
  } else if (operator === "/") {
    return secondOperand === 0 ? NaN : firstOperand / secondOperand;
  } else if (operator === "√") {
    return Math.sqrt(firstOperand);
  } else if (operator === "%") {
    return firstOperand / 100;
  }
  return secondOperand || firstOperand;
}

function resetCalculator() {
  kalkulator.displayValue = "0";
  kalkulator.firstOperand = null;
  kalkulator.waitingForSecondOperand = false;
  kalkulator.operator = null;
  kalkulator.expression = "";
  kalkulator.lastActionEquals = false;
  updateDisplay();
}

function handleEqual() {
  const { firstOperand, displayValue, operator, expression } = kalkulator;
  const inputValue = parseFloat(displayValue);

  if (operator === null || kalkulator.waitingForSecondOperand) {
    return;
  }

  const result = calculate(firstOperand, inputValue, operator);
  kalkulator.displayValue = `${parseFloat(result.toFixed(7))}`;
  kalkulator.expression = `${expression} ${inputValue} = ${kalkulator.displayValue}`;
  kalkulator.firstOperand = result;
  kalkulator.waitingForSecondOperand = false;
  kalkulator.operator = null;
  kalkulator.lastActionEquals = true;
  updateDisplay();
}

document
  .querySelector(".kalkulator-keys")
  .addEventListener("click", (event) => {
    const { target } = event;
    if (!target.matches("button")) return;

    if (target.classList.contains("operator")) {
      handleOperator(target.value);
      return;
    }

    if (target.classList.contains("equal-sign")) {
      handleEqual();
      return;
    }

    if (target.classList.contains("decimal")) {
      inputDecimal(target.value);
      return;
    }

    if (target.classList.contains("all-clear")) {
      resetCalculator();
      return;
    }

    inputDigit(target.value);
  });

updateDisplay();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const calculator = document.querySelector(".kalkulator");
  const operatorButtons = document.querySelectorAll(".operator");
  const numberButtons = document.querySelectorAll(
    ".kalkulator-keys button:not(.operator):not(.equal-sign):not(.all-clear)"
  );
  const zeroButton = document.querySelector(".zero");
  const decimalButton = document.querySelector(".decimal");
  const allClearButton = document.querySelector(".all-clear");
  const equalSignButton = document.querySelector(".equal-sign");

  const setTheme = (isDark) => {
    if (isDark) {
      body.classList.remove("bg-[#60BEFF]");
      body.classList.add("bg-[#1A202C]", "text-white");

      calculator.classList.remove("bg-[#F7F8FB]", "shadow-xs");
      calculator.classList.add("bg-[#17181A]", "shadow-xl");

      operatorButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-[#ADE2FF]",
          "text-[#109DFF]",
          "hover:bg-[#19ACFF]"
        );
        btn.classList.add(
          "bg-[#005DB2]",
          "text-[#339DFF]",
          "hover:bg-[#1991FF]",
          "hover:text-white",
          "hover:shadow-lg"
        );
      });

      numberButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-[#FFFFFF]",
          "text-[#38B9FF]",
          "hover:bg-[#19ACFF]"
        );
        btn.classList.add(
          "bg-[#303136]",
          "text-[#29A8FF]",
          "hover:bg-[#1991FF]",
          "hover:text-[#29A8FF]",
          "hover:shadow-lg"
        );
      });

      [zeroButton, decimalButton, allClearButton].forEach((btn) => {
        btn.classList.remove(
          "bg-[#FFFFFF]",
          "text-[#38B9FF]",
          "hover:bg-[#19ACFF]"
        );
        btn.classList.add(
          "bg-[#303136]",
          "text-[#29A8FF]",
          "hover:bg-[#1991FF]",
          "hover:text-white",
          "hover:shadow-lg"
        );
      });

      equalSignButton.classList.remove(
        "bg-[#ADE2FF]",
        "text-[#109DFF]",
        "hover:bg-[#19ACFF]"
      );
      equalSignButton.classList.add(
        "bg-[#005DB2]",
        "text-[#339DFF]",
        "hover:bg-[#1991FF]",
        "hover:text-white",
        "hover:shadow-lg"
      );

      themeToggle.classList.remove("bg-[#FFFFFF]", "hover:bg-black-100");
      themeToggle.classList.add(
        "bg-[#4A5568]",
        "text-white",
        "hover:bg-yellow-100",
        "hover:shadow-lg"
      );
      themeToggle.innerHTML = "☀️";
    } else {
      body.classList.remove("bg-[#1A202C]", "text-white");
      body.classList.add("bg-[#60BEFF]");

      calculator.classList.remove("bg-[#2D3748]", "shadow-xl");
      calculator.classList.add("bg-[#F7F8FB]", "shadow-xs");

      operatorButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-[#4A5568]",
          "text-[#90CDF4]",
          "hover:bg-[#63B3ED]",
          "hover:text-white",
          "hover:shadow-lg"
        );
        btn.classList.add("bg-[#ADE2FF]", "text-[#109DFF]");
      });

      numberButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-[#2D3748]",
          "text-white",
          "hover:bg-[#4A5568]",
          "hover:text-white",
          "hover:shadow-lg"
        );
        btn.classList.add("bg-[#FFFFFF]", "text-[#38B9FF]");
      });
      themeToggle.classList.remove("bg-[#FFFFFF]", "hover:bg-yellow-100");
      themeToggle.classList.add(
        "bg-[#4A5568]",
        "text-white",
        "hover:bg-black-100",
        "hover:shadow-lg"
      );
      [zeroButton, decimalButton, allClearButton].forEach((btn) => {
        btn.classList.remove(
          "bg-[#2D3748]",
          "text-white",
          "hover:bg-[#4A5568]",
          "hover:text-white",
          "hover:shadow-lg"
        );
        btn.classList.add("bg-[#FFFFFF]", "text-[#38B9FF]");
      });

      equalSignButton.classList.remove("bg-[#63B3ED]", "text-white");
      equalSignButton.classList.add("bg-[#ADE2FF]", "text-[#109DFF]");

      themeToggle.classList.remove("bg-[#4A5568]", "text-white");
      themeToggle.classList.add("bg-[#FFFFFF]", "hover:bg-[#000000]");
      themeToggle.innerHTML = "💡";
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggle.addEventListener("click", () => {
    const isCurrentlyDark = body.classList.contains("bg-[#1A202C]");
    setTheme(!isCurrentlyDark);
    localStorage.setItem("theme", !isCurrentlyDark ? "dark" : "light");
  });
});
