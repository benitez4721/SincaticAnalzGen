const isNoTerminal = (sym) => /^[A-Z]{1}$/.test(sym);
const isValidRule = (sym) => /(?!^.*[A-Z]{2,}.*$)^\D*$/.test(sym);

module.exports = { isNoTerminal, isValidRule };
