/**
 * @jest-environment jsdom
 */

import { createComponent, context } from "../lib/reactive-core.js";
import { describe, test, expect, beforeEach } from "@jest/globals";

function waitUntil(fn, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      if (fn()) resolve();
      else if (Date.now() - start > timeout) reject(new Error("waitUntil timeout"));
      else requestAnimationFrame(check);
    })();
  });
}

describe("Login flow using context pub/sub", () => {
  let loginComponent, statusComponent;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="status-app"></div>
      <div id="form-app"></div>
    `;
    context.clear();
  });

  test("User login updates AuthStatus via context", async () => {
    // AuthStatus listens for auth::login
    const AuthStatus = createComponent(() => {
      return `<div data-ref="status">Not logged in</div>`;
    }, {
      on: {
        "auth::login"(data) {
          const el = this.ref("status");
          if (el) el.textContent = `Welcome, ${data.user}!`;
        }
      },
      onMount() {
        statusComponent = this;
      }
    });

    // LoginForm emits auth::login on submit
    const LoginForm = createComponent(() => {
      return `
        <form data-ref="form">
          <input data-ref="username" />
          <button type="submit">Login</button>
        </form>
      `;
    }, {
      on: {
        "submit form"({ event, refs }) {
          event.preventDefault();
          const username = refs.username?.value?.trim();
          if (username) {
            context.emit("auth::login", { user: username });
          }
        }
      },
      onMount() {
        loginComponent = this;
      }
    });

    // Mount both
    AuthStatus.mount("#status-app");
    LoginForm.mount("#form-app");

    await waitUntil(() => loginComponent.ref("username") && statusComponent.ref("status"));

    // Simulate user input and submit
    loginComponent.ref("username").value = "Tova";
    loginComponent.ref("form").dispatchEvent(new Event("submit", { bubbles: true }));

    await waitUntil(() => statusComponent.ref("status").textContent.includes("Tova"));

    expect(statusComponent.ref("status").textContent).toBe("Welcome, Tova!");
  });
});
