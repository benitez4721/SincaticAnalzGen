const { expect } = require("@jest/globals");
const initParse = require("./parse");
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
  "BUILD",
];
test("empty create prec", () => {
  testActions.forEach((action) => execAction(action));
  expect(initParse("n+n*n")).toBe(true);
});
