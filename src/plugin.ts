penpot.ui.open("Gridify", `?theme=${penpot.theme}`, {
  width: 280,
  height: 390,
});

const generateDots = (message: any) => {
  let dots = [];
  for (let i = 0; i < message.columns; i++) {
    for (let e = 0; e < message.rows; e++) {
      const path = penpot.createEllipse();
      path.fills = [{ fillColor: "#000000" }];
      path.resize(message.size, message.size);
      path.x = i * message.columnGap;
      path.y = e * message.rowGap;
      dots.push(path);
    }
  }

  return dots;
};

const generateLines = (message: any) => {
  let lines = [];

  for (let i = 0; i < message.columns + 1; i++) {
    // Vertical lines
    const verticalLine = penpot.createPath();
    verticalLine.fills = [{ fillColor: "#000000" }];
    verticalLine.strokes = [
      {
        strokeColor: "#000000",
        strokeWidth: message.size,
        strokeCapStart: "square",
        strokeCapEnd: "square",
      },
    ];
    verticalLine.resize(0.01, message.rows * message.rowGap);
    verticalLine.x = i * message.columnGap;
    verticalLine.y = 0;
    lines.push(verticalLine);
  }

  for (let i = 0; i < message.rows + 1; i++) {
    // Horizontal lines
    const horizontalLine = penpot.createPath();
    horizontalLine.fills = [{ fillColor: "#000000" }];
    horizontalLine.strokes = [
      {
        strokeColor: "#000000",
        strokeWidth: message.size,
        strokeCapStart: "square",
        strokeCapEnd: "square",
      },
    ];
    horizontalLine.resize(message.columns * message.columnGap, 0.01);
    horizontalLine.x = 0;
    horizontalLine.y = i * message.rowGap;
    lines.push(horizontalLine);
  }

  return lines;
};

penpot.ui.onMessage<any>((message) => {
  if (message.msg === "create-grid") {
    let shapes = [];
    if (message.type === "dots") {
      shapes = generateDots(message);
    } else {
      shapes = generateLines(message);
    }

    const group = penpot.group(shapes);
    if (group) {
      group.x = penpot.viewport.center.x;
      group.y = penpot.viewport.center.y;

      if (message.type === "dots") {
        group.name = "Dot grid";
      } else {
        group.name = "Line grid";
      }

      penpot.selection = [group];
    }
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});
