penpot.ui.open("Gridify", `?theme=${penpot.theme}`, {
  width: 280,
  height: 360,
});

penpot.ui.onMessage<any>((message) => {
  if (message.msg === "create-text") {
    let shapes = [];
    for (let i = 0; i < message.columns; i++) {
      for (let e = 0; e < message.rows; e++) {
        //const path = penpot.createPath();
        const path = penpot.createEllipse();
        path.fills = [{ fillColor: "#000000" }];
        path.resize(message.size, message.size);
        path.x = i * message.columnGap;
        path.y = e * message.rowGap;
        shapes.push(path);
      }
    }

    const group = penpot.group(shapes);
    if (group) {
      group.x = penpot.viewport.center.x;
      group.y = penpot.viewport.center.y;
      group.name = "Dot grid";

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
