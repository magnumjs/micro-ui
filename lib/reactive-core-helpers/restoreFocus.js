let activeElement = null;
let activeSelection = null;

document.addEventListener("focusin", (e) => {
  activeElement = e.target;
  captureSelection();
});

// document.addEventListener("selectionchange", captureSelection);

function captureSelection() {
  if (
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA") &&
    typeof activeElement.selectionStart === "number"
  ) {
    activeSelection = {
      start: activeElement.selectionStart,
      end: activeElement.selectionEnd,
    };
  } else {
    // Preserve last known selection if focus lost to non-text element
    activeSelection = null;
  }
}

function restoreActiveElement() {
  if (!activeElement || document.activeElement === activeElement) return;

  // If still connected, do nothing

  // Try finding replacement inside the component root
  const { id, name, tagName } = activeElement;
  const selector = id
    ? `#${id}`
    : name
    ? `${tagName}[name="${name}"]`
    : tagName;
  const cpos = activeSelection;
  const found = this.el?.querySelector(selector);
  if (found) {
    activeElement = found;
    found.focus();
    try {
      found.setSelectionRange(cpos.start, cpos.end);
    } catch {
    }
  }
}


export { restoreActiveElement, captureSelection };