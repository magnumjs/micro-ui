

## 1. PDF: "How to Add a Live Code Example to MicroUI Docs"

You can use the Markdown/HTML guide I provided above. To create a PDF:

- Copy the guide into a Markdown file (e.g., `docs/AddLiveExampleGuide.md`).
- Use a tool like [Markdown to PDF](https://www.markdowntopdf.com/) or VS Code’s built-in Markdown PDF extension to export it.
- Alternatively, copy the content into a Google Doc or Word document and export as PDF.

---

## 2. More Detailed Template for a Second PDF

Here’s a more advanced template, including stepper navigation, code explanations, and best practices for MicroUI live examples:

---

# MicroUI Docs: Advanced Live Example Contribution Guide

## Overview

This guide walks you through creating a live, interactive code example for MicroUI docs, including step-by-step code walkthroughs, explanations, and best practices for maintainability and clarity.

---

## Step 1: Create Your Example Component

**File:**  
`docs/components/sections/YourLiveDemo.js`

**Example:**
```javascript
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

// Example: Stepper Counter Demo
const CounterDemo = createComponent(({ state = { count: 0 }, setState }) => {
  return `<div>
    <h3>Stepper Counter</h3>
    <div>Count: ${state.count}</div>
    <button onclick="this.parentNode.__setState({ count: state.count + 1 })">Increment</button>
    <button onclick="this.parentNode.__setState({ count: state.count - 1 })">Decrement</button>
  </div>`;
});
```

---

## Step 2: Add Stepper Navigation and Explanations

**Example:**
```javascript
export const CounterStepperSection = createComponent(({ step = 0 }) => {
  const codeLines = [
    "const CounterDemo = createComponent(({ state = { count: 0 }, setState }) => {",
    "  return `<div>`;",
    "    <h3>Stepper Counter</h3>",
    "    <div>Count: ${state.count}</div>",
    "    <button onclick=...>Increment</button>",
    "    <button onclick=...>Decrement</button>",
    "  </div>`;",
    "});"
  ];
  const explanations = [
    "Define a MicroUI component with state and setState.",
    "Start the render block.",
    "Add a header for the demo.",
    "Display the current count.",
    "Add an increment button.",
    "Add a decrement button.",
    "Close the render block.",
    "Close the component definition."
  ];
  // ...render code block and explanation for current step...
});
```

---

## Step 3: Register and Link in Docs

- Import your section in main.js.
- Add to the section registry and sidebar navigation.

---

## Step 4: Best Practices

- Use clear code blocks and explanations.
- Keep live demos minimal but interactive.
- Use stepper navigation for multi-step code walkthroughs.
- Document each line or block for clarity.

---

## Step 5: Submit Your PR

- Include your new section file, sidebar update, and any assets.
- Add screenshots and a summary in your PR.

---
