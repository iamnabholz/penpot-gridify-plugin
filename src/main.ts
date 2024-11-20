import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const choiceSelector = document.querySelector(".choice-selector")!;
let selectedValue = "Dots";

choiceSelector.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.tagName === "P") {
    // Remove current selection
    const currentSelected = choiceSelector.querySelector(".choice-selected");
    currentSelected?.classList.remove("choice-selected");

    // Add selection to clicked item
    target.classList.add("choice-selected");
    selectedValue = target.textContent || "Dots";
  }
});

document
  .querySelector("[data-handler='create-text']")
  ?.addEventListener("click", () => {
    const dotSizeInput = document.getElementById(
      "dot-size",
    ) as HTMLInputElement;

    const columns = document.getElementById("columns") as HTMLInputElement;
    const rows = document.getElementById("rows") as HTMLInputElement;

    const columnGap = document.getElementById("column-gap") as HTMLInputElement;
    const rowGap = document.getElementById("row-gap") as HTMLInputElement;

    // send message to plugin.ts
    parent.postMessage(
      {
        msg: "create-text",
        size: parseInt(dotSizeInput.value),
        rows: parseInt(rows.value),
        columns: parseInt(columns.value),
        rowGap: parseInt(rowGap.value),
        columnGap: parseInt(columnGap.value),
      },
      "*",
    );
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
