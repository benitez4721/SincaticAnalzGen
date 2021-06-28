const lexer = require("./lexer");
const { f, g, noTerminals, rules } = require("./globals");

const printRows = [];
const initParse = (phraseInput) => {
  let phrase = phraseInput.split(" ");
  let entry = ["$"];
  const { tokens, errors } = lexer(phrase.join("").split(""));
  if (errors.length) {
    console.log(
      `ERROR: Los siguientes simbolos no son terminales de la gramatica: ${errors}`
    );
    return;
  }
  const phraseWithPred = [];
  tokens.forEach((token, idx) => {
    phraseWithPred.push(token);
    if (idx + 1 < tokens.length) {
      if (f[token] > g[tokens[idx + 1]]) {
        phraseWithPred.push(">");
      } else {
        phraseWithPred.push("<");
      }
    }
  });
  phraseWithPred.push(">");
  phraseWithPred.push("$");
  parse(phraseWithPred, "<", entry, "leer");
  printParserTable();
  return "";
};

let stack = ["$"];

const parse = (phrase, pred, entry, action, rule = "") => {
  printRows.push({
    Pila: stack.join(" "),
    Frase_leida: entry.join(" "),
    Precedencia_leida: pred,
    Frase_por_leer: phrase.join(" "),
    Accion: action,
  });
  if (action === "leer") {
    nextToken = phrase.shift();
    entry.push(pred);
    entry.push(nextToken);
    stack.push(nextToken);
    pred = phrase.shift();
    parse(phrase, pred, entry, getParseAction(entry, pred, phrase));
  } else if (action === "reducir") {
    let actualSym = stack.pop();
    let numSymbolsOut = noTerminals.includes(actualSym) ? 0 : 1;
    let firstSymbolIsNoTerminal = noTerminals.includes(actualSym)
      ? true
      : false;
    let lexema = [actualSym];
    while (
      firstSymbolIsNoTerminal ||
      noTerminals.includes(stack[stack.length - 1]) ||
      f[stack[stack.length - 1]] > g[actualSym]
    ) {
      actualSym = stack.pop();
      !noTerminals.includes(actualSym) && numSymbolsOut++;
      lexema.unshift(actualSym);
      firstSymbolIsNoTerminal = false;
    }
    let noTerminalReduce = rules[lexema.join("")];

    if (!noTerminalReduce) {
      console.log("Error: ", lexema.join(" "));
      return;
    }
    printRows[printRows.length - 1][
      "Reduce_Rule"
    ] = `${noTerminalReduce} -> ${lexema.join(" ")}`;
    stack.push(noTerminalReduce);
    for (let i = 1; i <= numSymbolsOut * 2; i++) {
      entry.pop();
    }

    if (f[entry[entry.length - 1]] > g[phrase[0]]) {
      pred = ">";
    } else {
      pred = "<";
    }
    parse(phrase, pred, entry, getParseAction(entry, pred, phrase));
  }
};

const getParseAction = (entry, pred, phrase) => {
  if (entry.length === 1 && phrase.length === 1) {
    return "aceptar";
  }

  if (pred === "<") {
    return "leer";
  }
  return "reducir";
};

const printParserTable = () => {
  console.table(printRows);
};

module.exports = initParse;
