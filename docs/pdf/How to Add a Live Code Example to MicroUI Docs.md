# How to Add a Live Code Example to MicroUI Docs

## 1. Create a New Docs Section File

**File location:**  
`docs/components/sections/YourExample.js`

```js
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

// Your live demo logic
const DemoWidget = createComponent(({ state = { count: 0 }, setState }) => {
  return `<div>
    <h3>Live Counter</h3>
    <div>Count: ${state.count}</div>
    <button onclick="this.parentNode.__setState({ count: state.count + 1 })">Increment</button>
  </div>`;
});

export const YourExampleSection = createComponent(() => {
  return `<section>
    <h2>Live Counter Example</h2>
    <div id="demo-area"></div>
    <pre><code class="language-js">
// ...show code here for users to copy...
    </code></pre>
    <div class="explanation">
      **Explanation:** This example demonstrates a reactive counter using MicroUI's setState.
    </div>
  </section>`;
}, {
  onMount: () => {
    DemoWidget.mount("#demo-area");
  }
});
```

---

## 2. Register the Section in main.js

**Add import:**
```js
import { YourExampleSection } from "./components/sections/YourExample.js";
```

**Add to section registry:**
```js
const sectionIds = [..., 'your-example'];
const sectionComponents = {
  // ...existing code...
  'your-example': YourExampleSection
};
```

**Add sidebar link:**
```html
<li><a href="#your-example" data-section="your-example">🧪 Your Example</a></li>
```

---

## 3. Add Step-by-Step Code Blocks and Explanations

**Format:**
- Use `<pre><code>` for code blocks.
- Use `<div class="explanation">` for explanations.
- Optionally, use a stepper UI to walk through each line.

**Example:**
```html
<pre><code class="language-js">
// 1. Create a reactive state
const [getCount, setCount] = setState(0);

// 2. Render the counter UI
return `<div>
  <div>Count: ${getCount()}</div>
  <button onclick="setCount(getCount() + 1)">Increment</button>
</div>`;
</code></pre>
<div class="explanation">
  **Step 1:** Initializes the counter state.  
  **Step 2:** Renders the UI and handles increment.
</div>
```

---

## 4. Test Your Example

- Open the docs site and navigate to your new section.
- Confirm the live demo works and code/explanations are readable.

---

## 5. Submit a Pull Request

- Include your new section file and any changes to main.js or sidebar navigation.
- Add a short description and screenshots if possible.

---
