const { isNoTerminal, isValidRule } = require("./validators");
const { terminals, noTerminals, rules } = require("./globals");

const createRule = (rule) => {
  const splitedRule = rule.split(" ");
  const rightProd = splitedRule.slice(1);
  const leftProd = splitedRule[0];

  if (!leftProd) {
    return "ERROR: Para crear una regla debe ingresar al menos un símbolo no terminal.\n";
  }
  if (!isNoTerminal(leftProd)) {
    return `ERROR: "${leftProd}" no es un simbolo no terminal.`;
  }
  if (!isValidRule(rightProd.join(""))) {
    return `ERROR: Regla "${leftProd} -> ${rightProd.join(
      " "
    )}", no corresponde a una gramática de operadores.`;
  }

  const noTerminalSymbolsRule = rightProd.filter((sym) => isNoTerminal(sym));

  const terminalsSymbolsRule = rightProd.filter((sym) => !isNoTerminal(sym));

  let undefinedNoTerminal = null;
  noTerminalSymbolsRule.forEach((sym) => {
    if (!noTerminals.includes(sym) && sym !== leftProd) {
      undefinedNoTerminal = sym;
      return;
    }
  });

  if (undefinedNoTerminal) {
    return (
      "No existe una regla para el no terminal " + `'${undefinedNoTerminal}'`
    );
  }

  !noTerminals.includes(leftProd) && noTerminals.push(leftProd);
  terminalsSymbolsRule.forEach((sym) => {
    !terminals.includes(sym) ? terminals.push(sym) : null;
  });

  rules[rightProd.join("")] = rule[0];
  return `Regla "${leftProd} -> ${
    rightProd.join(" ") || "λ"
  }" agregada a la gramatica`;
};

module.exports = createRule;
