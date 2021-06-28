const { exit } = require("process");
const { terminals, noTerminals } = require("./globals");
const readline = require("readline");
const createRule = require("./createRule");
const createPrec = require("./createPrec");
const build = require("./build");
const parse = require("./parse");

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

let startSymbol;

const execAction = (command) => {
  if (!command) {
    return "Acción no válida\n";
  }
  const splitCommand = command.split(" ").filter((val) => val);
  const action = splitCommand[0];
  if (!actions[action]) {
    return "Acción no válida\n";
  }
  return actions[action](splitCommand.slice(1).join(" "));
};

const setStartSymbol = (symbol) => {
  if (!symbol) {
    return "ERROR: Debe ingresar un simbolo no terminal.\n";
  }
  if (noTerminals.includes(symbol[0])) {
    startSymbol = symbol;
    return `"${symbol}" es ahora el símbolo inicial de la gramática\n`;
  }

  return `ERROR: "${symbol}" no es un símbolo no-terminal\n`;
};

const askForAction = () => {
  rl.question("Ingrease una accion \n", (action) => {
    if (action === "0") {
      rl.close();
      return;
    }
    console.log(execAction(action));
    askForAction();
  });
};

const actions = {
  RULE: createRule,
  INIT: setStartSymbol,
  PREC: createPrec,
  BUILD: build,
  PARSE: parse,
};

// testActions2.forEach((action) => {
//   console.log(execAction(action));
// });

askForAction();

module.exports = { execAction, terminals, noTerminals };
