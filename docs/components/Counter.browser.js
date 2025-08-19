// Counter.browser.js (for CDN/browser usage)
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { counterConfig } from "./Counter.core.js";

export const Counter = createComponent(counterConfig.render, counterConfig.options);
