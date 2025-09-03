/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js"; // your full MicroUI core
import { context } from "../lib/reactive-core-helpers/context.js"; // context management
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
function waitUntil(conditionFn, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const checkCondition = () => {
      if (conditionFn()) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error("Condition not met within timeout"));
      } else {
        requestAnimationFrame(checkCondition);
      }
    };
    checkCondition();
  });
}
describe("Micro UI context pub/sub integration", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    context.clear();
  });

test("Consumer receives context event emitted by Provider", async () => {
  const received = [];

  const Consumer = createComponent(() => {
    return `<div data-ref="output">Waiting...</div>`;
  }, {
    on: {
      "auth::get"(data) {
        const el = this.ref("output");
        if (el) el.textContent = `Hello, ${data.user}`;
        received.push(data);
      }
    }
  });

  const Provider = createComponent(() => {
    return `<button data-ref="btn">Emit</button>`;
  }, {
    on: {
      "click button"() {
        context.emit("auth::get", { user: "Tova" });
      }
    }
  });

  // 🔧 mount both
const consumerRoot = document.createElement("div");
document.body.appendChild(consumerRoot);

const providerRoot = document.createElement("div");
document.body.appendChild(providerRoot);

Consumer.mount(consumerRoot);
Provider.mount(providerRoot);


  // ✅ wait until DOM element exists
  await waitUntil(() => Consumer.ref("output"));

  // 🔧 Wait 1 frame before clicking, to allow all refs to be hydrated
  await new Promise(requestAnimationFrame);

  
  // 🔥 Trigger emit
  Provider.ref("btn").click();

  // 🧪 wait for received context data
  await waitUntil(() => received.length > 0);

  expect(received[0]).toEqual({ user: "Tova" });
  expect(Consumer.ref("output").textContent).toBe("Hello, Tova");
});


});
