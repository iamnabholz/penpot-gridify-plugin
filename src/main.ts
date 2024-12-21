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
  .querySelector("[data-handler='create-grid']")
  ?.addEventListener("click", () => {
    const sizeInput = document.getElementById("size") as HTMLInputElement;

    const columns = document.getElementById("columns") as HTMLInputElement;
    const rows = document.getElementById("rows") as HTMLInputElement;

    const columnGap = document.getElementById("column-gap") as HTMLInputElement;
    const rowGap = document.getElementById("row-gap") as HTMLInputElement;

    // send message to plugin.ts
    parent.postMessage(
      {
        msg: "create-grid",
        type: selectedValue.toLowerCase(),
        size: parseFloat(sizeInput.value),
        rows: parseInt(rows.value),
        columns: parseInt(columns.value),
        rowGap: parseInt(rowGap.value),
        columnGap: parseInt(columnGap.value),
      },
      "*",
    );
  });

// Lock buttons functionality
const lockAmount = document.getElementById("lock-amount")!;
const lockGap = document.getElementById("lock-gap")!;

const rowsInput = document.getElementById("rows") as HTMLInputElement;
const columnsInput = document.getElementById("columns") as HTMLInputElement;
const rowGapInput = document.getElementById("row-gap") as HTMLInputElement;
const columnGapInput = document.getElementById(
  "column-gap",
) as HTMLInputElement;

// SVG paths for locked and unlocked states
const lockedSvgPath = `<path d="M6 8v-2c0-3.313 2.687-6 6-6 3.312 0 6 2.687 6 6v2h-2v-2c0-2.206-1.795-4-4-4s-4 1.794-4 4v2h-2zm-3 2v14h18v-14h-18z"/>`;
const unlockedSvgPath = `<path d="M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12zm8 2h-14v10h14v-10z"/>`;

// Function to handle lock button clicks
function setupLockButton(
  button: HTMLElement,
  input1: HTMLInputElement,
  input2: HTMLInputElement,
) {
  let isLocked = false;
  let syncInputs: ((event: Event) => void) | null = null;

  button.addEventListener("click", () => {
    isLocked = !isLocked;
    button.classList.toggle("locked", isLocked);

    // Update SVG
    const svg = button.querySelector("svg");
    if (svg) {
      svg.innerHTML = isLocked ? lockedSvgPath : unlockedSvgPath;
    }

    if (isLocked) {
      // When locked, sync the second input with the first
      input2.value = input1.value;

      // Add input event listener to keep values in sync
      syncInputs = () => {
        input2.value = input1.value;
      };

      input1.addEventListener("input", syncInputs);
      button.dataset.inputListener = "true";
    } else {
      // Remove sync listener when unlocked
      if (syncInputs) {
        input1.removeEventListener("input", syncInputs);
        syncInputs = null;
      }
    }
  });
}

// Setup both lock buttons
setupLockButton(lockAmount, columnsInput, rowsInput);
setupLockButton(lockGap, columnGapInput, rowGapInput);

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
