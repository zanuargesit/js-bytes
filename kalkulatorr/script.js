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
      if(kalkulator.expression) {
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

      const { displayValue, waitingForSecondOperand, expression, operator } = kalkulator;

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

    document.querySelector(".kalkulator-keys").addEventListener("click", (event) => {
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