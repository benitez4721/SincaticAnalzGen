const { expect } = require("@jest/globals");
const { execAction } = require("./reconocedor");

test("empty action", () => {
  expect(execAction("")).toBe("Acción no válida\n");
});

test("unknown action", () => {
  expect(execAction("QLQ")).toBe("Acción no válida\n");
});
