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
    selectedValue = target.textContent || "Any";
  }
});

document
  .querySelector("[data-handler='create-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("create-text", "*");
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
