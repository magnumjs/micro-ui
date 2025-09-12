import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";
import { DocsSection } from "../../comps/DocsSection.js";
import { CounterFunc, CounterSetup } from "./CounterCode.js";
import { unescapeFunctionCode } from "../../utils/escapeCode.js";

const CounterInstance = createComponent(CounterFunc, CounterSetup);

export const CounterExample = createComponent({
  render() {
    return `
        <h3>Counter Example</h3>
        ${CounterInstance()}
        <p>This is a placeholder for the Counter demo.</p>
        ${DocsSection({
          title: "Getting Started",
          body: "This section explains how to use Micro-UI with Bootstrap.",
          code: `const Counter = createComponent(${CounterFunc.toString()}),\n${unescapeFunctionCode(
            CounterSetup
          )}`,
        })}
  `;
  },
});
