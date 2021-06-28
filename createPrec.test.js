const createPrec = require("./createPrec");
const { expect } = require("@jest/globals");
const createRule = require("./createRule");

test("empty create prec", () => {
  expect(createPrec("")).toBe(
    `ERROR: Precedencia incorrecta, debe ser de la forma "terminal (> || < || =) terminal."\n`
  );
});

test("invalid relation symbol", () => {
  expect(createPrec("+ & +")).toBe(
    `ERROR: Relación de presedencia incorrecta, debe ser alguna de las siguientes: (> || < || =).\n`
  );
});

test("invalid terminal symbol", () => {
  expect(createPrec("+ > +")).toBe(`Simbolo terminal invalido.\n`);
});

test("success '>' precendence created", () => {
  createRule("E E + E");
  expect(createPrec("+ > +")).toBe(`"+" tiene mayor precedencia que "+"\n`);
});

test("success '>' precendence created", () => {
  createRule("E E + E");
  expect(createPrec("+ < +")).toBe(`"+" tiene menor precedencia que "+"\n`);
});
