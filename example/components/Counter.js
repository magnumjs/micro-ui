// example/components/Counter.js
import { createComponent } from "@magnumjs/micro-ui";
import { counterConfig } from "./Counter.core.js";

export const Counter = createComponent(counterConfig.render, counterConfig.options);
