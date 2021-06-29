const { exit } = require("process");
let { f, g, graph, hasCicle } = require("./globals");

let graphLevel = 0;
const build = () => {
  calcFuncs();
  if (hasCicle["hc"]) {
    console.log(
      "ERROR: No es posible calcular las funciones f y g, el grafo tiene un ciclo"
    );
    exit();
  }
  console.log("Analizador sintactico construido.\n");
  console.log("Valores para f:\n");
  Object.entries(f).forEach(([symbol, val]) =>
    console.log(`    ${symbol}: ${val}`)
  );
  console.log("Valores para g:\n");
  Object.entries(g).forEach(([symbol, val]) =>
    console.log(`    ${symbol}: ${val}`)
  );
  return "";
};

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

module.exports = { build, calcFuncs };
