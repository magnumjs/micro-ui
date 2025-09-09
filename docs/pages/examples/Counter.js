import { createComponent } from "//unpkg.com/@magnumjs/micro-ui";
import DocsSection from "../../comps/DocsSection.js";
import { CounterFunc, CounterSetup } from "./CounterCode.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";



// To unescape other common escape sequences (example: backslash, quotes)
function unescapeFunctionCode(escapedCode) {
  let unescapedCode = escapedCode;

  // Replace common escape sequences
  unescapedCode = unescapedCode.replace(/\\n/g, '\n');
  unescapedCode = unescapedCode.replace(/\\t/g, '\t');
  unescapedCode = unescapedCode.replace(/\\\\/g, '\\');
  unescapedCode = unescapedCode.replace(/\\'/g, "'");
  unescapedCode = unescapedCode.replace(/\\"/g, '"');
  unescapedCode = unescapedCode.replace(/\\r/g, '\r');
  unescapedCode = unescapedCode.replace(/\\b/g, '\b');
  unescapedCode = unescapedCode.replace(/\\f/g, '\f');
  unescapedCode = unescapedCode.replace(/""/g, '"');
  unescapedCode = unescapedCode.replace(/}"/g, '}');

  // Handle Unicode escapes (more complex, might require parsing hex values)
  unescapedCode = unescapedCode.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
console.log(unescapedCode)
  return unescapedCode;
}


const stringifiedObjectWithFunctions = (myObject) =>
  JSON.stringify(
    myObject,
    (key, value) => {
      if (typeof value === "function") {
        // Convert the function to its string representation (source code)
        return value.toString();
      }
      return value; // Return other values as they are
    },
    2
  );

const CounterInstance = createComponent(CounterFunc, CounterSetup);

export const CounterExample = createComponent({
  render() {
    return `
        <h3>Counter Example</h3>
        <div data-comp="${CounterInstance}">${CounterInstance()}</div>
        <p>This is a placeholder for the Counter demo.</p>
        ${DocsSection({
  title: "Getting Started",
  body: "This section explains how to use Micro-UI with Bootstrap.",
  code: `const Counter = createComponent(${CounterFunc.toString()}),\n${unescapeFunctionCode(stringifiedObjectWithFunctions(
    CounterSetup
  ))}`,
})}
  `;
}
});



