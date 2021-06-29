const { expect } = require("@jest/globals");
const { calcFuncs } = require("./build");
const { f, g } = require("./globals");
const { execAction } = require("./reconocedor");
const testActions = [
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
];
test("empty create prec", () => {
  testActions.forEach((action) => execAction(action));
  calcFuncs();
  expect(f).toStrictEqual({ $: 0, "+": 2, n: 4, "*": 4 });
  expect(g).toStrictEqual({ $: 0, "+": 1, "*": 3, n: 5 });
});
