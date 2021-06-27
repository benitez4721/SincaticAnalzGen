const { exit } = require("process");
const readline = require("readline");

const isNoTerminal = (sym) => /^[A-Z]{1}$/.test(sym);
const isValidRule = (sym) => /(?!^.*[A-Z]{2,}.*$)^\D*$/.test(sym);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const testActions = [
  "RULE E E + E",
  "RULE E E * E",
  "RULE E id",
  "PREC id > +",
  "PREC id > *",
  "PREC id > $",
  "PREC + < id",
  "PREC + > +",
  "PREC + < *",
  "PREC + > $",
  "PREC * < id",
  "PREC * > +",
  "PREC * > *",
  "PREC * > $",
  "PREC $ < id",
  "PREC $ < +",
  "PREC $ < *",
  "BUILD",
  "PARSE id + id",
];

const testActions2 = [
  "RULE E E + E",
  "RULE E E * E",
  "RULE E n",
  "INIT E",
  "PREC n > +",
  "PREC n > *",
  "PREC n > $",
  "PREC + < n",
  "PREC + > +",
  "PREC + < *",
  "PREC + > $",
  "PREC * < n",
  "PREC * > +",
  "PREC * > *",
  "PREC * > $",
  "PREC $ < n",
  "PREC $ < +",
  "PREC $ < *",
  "BUILD",
  "PARSE n + n * n",
];

const rules = {};

let noTerminals = [];
let terminals = ["$"];
let startSymbol;
let graph = {};
let g = {};
let f = {};
let graphLevel = 0;

const calcFuncs = (v) => {
  const tempGraph = JSON.parse(JSON.stringify(graph));
  while (Object.entries(tempGraph).length > 0) {
    findEmptyAdy(tempGraph);
    graphLevel++;
  }
};

const findEmptyAdy = (tempGraph) => {
  const emptyAdy = Object.entries(tempGraph).filter(
    ([, adyList]) => adyList.length === 0
  );
  removeNodes(
    emptyAdy.map((entry) => entry[0]),
    tempGraph
  );
};

const removeNodes = (nodes, tempGraph) => {
  nodes.forEach((node) => {
    for (key in tempGraph) {
      if (key === node) {
        const func = key.charAt(0);
        const symbol = key.slice(1);
        if (func === "g") {
          g[symbol] = graphLevel;
        } else {
          f[symbol] = graphLevel;
        }
        delete tempGraph[key];
      } else {
        tempGraph[key] = tempGraph[key].filter((keyNode) => keyNode !== node);
      }
    }
  });
};

const execAction = (action) => {
  const actionInst = action[0];
  if (!actions[actionInst]) {
    console.log("Accion no valida\n");
    return;
  }
  actions[actionInst](action.slice(1));
};

const setStartSymbol = (symbol) => {
  if (
    symbol.length > 0 &&
    isNoTerminal(symbol[0]) &&
    noTerminals.includes(symbol[0])
  ) {
    startSymbol = symbol[0];
    return;
  }

  console.log("Debe ingresar un simbolo no terminal valido");
};

const createRule = (rule) => {
  const rightProd = rule.slice(1);
  const leftProd = rule[0];
  if (!isNoTerminal(leftProd)) {
    console.log("Simbolo terminal " + `"${leftProd}"` + " no es valido.");
    return;
  }
  if (!isValidRule(rightProd.join(""))) {
    console.log("Regla no valida, no es una gramatica de operador.");
    return;
  }

  const noTerminalSymbolsRule = rightProd.filter((sym) => isNoTerminal(sym));

  const terminalsSymbolsRule = rightProd.filter((sym) => !isNoTerminal(sym));

  let skip = false;
  noTerminalSymbolsRule.forEach((sym) => {
    if (!noTerminals.includes(sym) && sym !== leftProd) {
      console.log("No existe una regla para el no terminal " + `"${sym}"`);
      skip = true;
      return;
    }
  });

  if (skip) {
    return;
  }

  !noTerminals.includes(leftProd) && noTerminals.push(leftProd);
  terminalsSymbolsRule.forEach((sym) => {
    !terminals.includes(sym) ? terminals.push(sym) : null;
  });

  rules[rightProd.join("")] = rule[0];
  console.log(
    `Regla "${leftProd} -> ${rightProd.join(" ")}" agregada a la gramatica`
  );
};

const createPrec = (prec) => {
  if (prec.length !== 3) {
    console.log(
      'Precedencia incorrecta, debe ser de la forma "terminal (> || < || =) terminal."\n'
    );
    return;
  }
  if (![">", "<", "="].includes(prec[1])) {
    console.log(
      "Precedencia incorrecta, debe ser alguna de las siguientes: (> || < || =).\n"
    );
    return;
  }

  if (!terminals.includes(prec[0]) || !terminals.includes(prec[2])) {
    console.log("Simbolo terminal invalido.\n");
    return;
  }

  const f1 = `f${prec[0]}`;
  const g1 = `g${prec[0]}`;

  const f2 = `f${prec[2]}`;
  const g2 = `g${prec[2]}`;

  if (!graph[f1]) {
    graph[f1] = [];
    graph[g1] = [];
  }

  if (!graph[f2]) {
    graph[f2] = [];
    graph[g2] = [];
  }

  if (prec[1] === "<") {
    if (!graph[g2].includes(f1)) {
      graph[g2].push(f1);
    }

    console.log(`"${prec[0]}" tiene menor precedencia que "${prec[2]}"`);
  } else if (prec[1] === ">") {
    if (!graph[f1].includes(g2)) {
      graph[f1].push(g2);
    }

    console.log(`"${prec[0]}" tiene mayor precedencia que "${prec[2]}"`);
  }
  return;
};

const build = () => {
  calcFuncs();
  console.log("Analizador sintactico construido.\n");
  console.log("Valores para f:\n");
  Object.entries(f).forEach(([symbol, val]) =>
    console.log(`    ${symbol}: ${val}`)
  );
  console.log("Valores para g:\n");
  Object.entries(g).forEach(([symbol, val]) =>
    console.log(`    ${symbol}: ${val}`)
  );
};

const printRows = [];
const tabStack = 15;
const tabAction = 15;

const initParse = (phrase) => {
  let entry = ["$"];
  const { tokens, errors } = lexer(phrase.join("").split(""));
  console.log(graph);
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
  // printRows.push(
  //   `Pila${" ".repeat(tabStack)}Entrada${" ".repeat(tabAction)} Accion`
  // );
  parse(phraseWithPred, "<", entry, "leer");
  printParserTable();
};

let stack = ["$"];

const parse = (phrase, pred, entry, action, rule = "") => {
  printRows.push(
    {
      Pila: stack.join(" "),
      Frase_leida: entry.join(" "),
      Precedencia_leida: pred,
      Frase_por_leer: phrase.join(" "),
      Accion: action,
    }
    // `${stack.join(" ")}${" ".repeat(tabStack)} ${entry.join(
    //   " "
    // )}   ${pred}   ${phrase.join(" ")}${" ".repeat(
    //   tabAction
    // )} ${action} ${rule}`
  );
  // console.log("Pila: ", stack.join(" "));
  // console.log(`Entrada: ${entry.join(" ")}   ${pred}   ${phrase.join(" ")}`);
  // console.log("Action: ", `${action} ${rule}`);
  // console.log("\n");
  if (action === "leer") {
    nextToken = phrase.shift();
    entry.push(pred);
    entry.push(nextToken);
    stack.push(nextToken);
    pred = phrase.shift();
    parse(phrase, pred, entry, getAction(entry, pred, phrase));
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
    parse(phrase, pred, entry, getAction(entry, pred, phrase));
  }
};

const getAction = (entry, pred, phrase) => {
  if (entry.length === 1 && phrase.length === 1) {
    return "aceptar";
  }

  if (pred === "<") {
    return "leer";
  }
  return "reducir";
};

const lexer = (phrase) => {
  const tokens = [];
  const errors = [];
  let lexema = "";
  phrase.forEach((c) => {
    lexema += c;
    if (
      terminals.some(
        (terminal) =>
          terminal.startsWith(lexema) && terminal.length === lexema.length
      )
    ) {
      tokens.push(lexema);
      lexema = "";
    } else if (terminals.every((terminal) => !terminal.startsWith(lexema))) {
      errors.push(lexema);
      lexema = "";
    }
  });
  return { tokens, errors };
};

const printParserTable = () => {
  console.table(printRows);
};

const askForAction = () => {
  rl.question("Ingrease una accion \n", (action) => {
    if (action === "0") {
      rl.close();
      console.log(rules);
      console.log(terminals);
      console.log(noTerminals);
      console.log(startSymbol);
      return;
    }
    execAction(action.split(" ").filter((val) => val));
    askForAction();
  });
};

const actions = {
  RULE: createRule,
  INIT: setStartSymbol,
  PREC: createPrec,
  BUILD: build,
  PARSE: initParse,
};

testActions2.forEach((action) => {
  execAction(action.split(" ").filter((val) => val));
});

// askForAction();
