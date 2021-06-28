const createRule = require("./createRule");
const { expect } = require("@jest/globals");

test("empty create rule", () => {
  expect(createRule("")).toBe(
    "ERROR: Para crear una regla debe ingresar al menos un símbolo no terminal.\n"
  );
});

test("create rule with invalid no terminal", () => {
  expect(createRule("a")).toBe('ERROR: "a" no es un simbolo no terminal.');
});

test("invalid grammar", () => {
  expect(createRule("A B B")).toBe(
    'ERROR: Regla "A -> B B", no corresponde a una gramática de operadores.'
  );
});

test("invalid no terminal in right side", () => {
  expect(createRule("A B")).toBe(`No existe una regla para el no terminal 'B'`);
});

test("rule with lamda production", () => {
  expect(createRule("A")).toBe('Regla "A -> λ" agregada a la gramatica');
});

test("success rule created", () => {
  expect(createRule("A A + A")).toBe(
    'Regla "A -> A + A" agregada a la gramatica'
  );
});
