const { terminals } = require("./globals");

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

module.exports = lexer;
