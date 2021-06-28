const { terminals, graph } = require("./globals");

const createPrec = (precInput) => {
  let prec = precInput.split(" ");
  if (prec.length !== 3) {
    return 'ERROR: Precedencia incorrecta, debe ser de la forma "terminal (> || < || =) terminal."\n';
  }
  if (![">", "<", "="].includes(prec[1])) {
    return "ERROR: Relación de presedencia incorrecta, debe ser alguna de las siguientes: (> || < || =).\n";
  }

  if (!terminals.includes(prec[0]) || !terminals.includes(prec[2])) {
    return "Simbolo terminal invalido.\n";
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

    return `"${prec[0]}" tiene menor precedencia que "${prec[2]}"\n`;
  } else if (prec[1] === ">") {
    if (!graph[f1].includes(g2)) {
      graph[f1].push(g2);
    }

    return `"${prec[0]}" tiene mayor precedencia que "${prec[2]}"\n`;
  }
  return;
};

module.exports = createPrec;
