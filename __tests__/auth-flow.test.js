/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core";
import { shared, context } from "../lib/utils/context.js"; // context management
import { describe, beforeEach, test, expect } from "@jest/globals";

describe("App login/logout flow", () => {
  let root;
  let LoginButton, LogoutButton, UserPanel;

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
    root = document.querySelector("#app");
    context.clear(); // reset shared state & listeners

    const auth = shared("auth", { user: null });

    LoginButton = createComponent(
      () => {
        return `<button data-ref="login">Login</button>`;
      },
      {
        on: {
          "click [data-ref='login']": () => {
            auth.emit("login", { user: "Tova" });
          },
        },
      }
    );

    LogoutButton = createComponent(
      () => {
        return `<button data-ref="logout">Logout</button>`;
      },
      {
        on: {
          "click [data-ref='logout']": () => {
            auth.emit("logout", { user: null });
          },
        },
      }
    );

    UserPanel = createComponent(
      () => {
        const { user } = auth.get();
        return `<div><span data-ref="user">${
          user ? `Welcome, ${user}` : "Not logged in"
        }</span></div>`;
      },
      {
        onMount() {
          this._login = auth.on("login", () => this.update());
          this._logout = auth.on("logout", () => this.update());
        },
        onUnmount() {
          this._login?.();
          this._logout?.();
        },
      }
    );

    // Mount all
    root.innerHTML = `
      <div id="login-app"></div>
      <div id="logout-app"></div>
      <div id="user-app"></div>
    `;
    LoginButton.mount("#login-app");
    LogoutButton.mount("#logout-app");
    UserPanel.mount("#user-app");
  });

  test("Login emits user, UserPanel shows name, Logout clears state", async () => {
    // Initial state
    expect(UserPanel.ref("user").textContent).toBe("Not logged in");

    // Click login
    LoginButton.ref("login").click();
    await Promise.resolve(); // wait for microtask flush

    expect(UserPanel.ref("user").textContent).toBe("Welcome, Tova");

    // Click logout
    LogoutButton.ref("logout").click();
    await Promise.resolve();

    expect(UserPanel.ref("user").textContent).toBe("Not logged in");
  });
});
