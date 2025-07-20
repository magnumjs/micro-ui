/**
 * @jest-environment jsdom
 */

import { createState, createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("Conditional Rendering & Lifecycle", () => {
  let container;
  let appState;

  let LoginForm, LoggedIn;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app");

    appState = createState({ user: null });

    const loginMount = jest.fn();
    const loginDestroy = jest.fn();
    const loggedInMount = jest.fn();
    const loggedInDestroy = jest.fn();

    LoginForm = createComponent(() => `<button id="login">Log In</button>`, {
      onMount: loginMount,
      onUnmount: loginDestroy,
      events: {
        click(e) {
          if (e.target.id === "login") {
            appState.setState({ user: { name: "Tester" } });
          }
        },
      },
    });

    LoggedIn = createComponent(
      ({ user }) => {
        if (!user) return `<p>No user info</p>`;
        return `<h1>Welcome, ${user.name}!</h1>`;
      },
      {
        onMount: loggedInMount,
        onUnmount: loggedInDestroy,
      }
    );

    // Attach spies for assertions
    LoginForm._mountSpy = loginMount;
    LoginForm._destroySpy = loginDestroy;
    LoggedIn._mountSpy = loggedInMount;
    LoggedIn._destroySpy = loggedInDestroy;

    appState.subscribe(renderApp);

    // Force initial render synchronously
    // renderApp(appState.get());
  });
  function renderApp(state) {
    if (state.user) {
      LoginForm.unmount();
      LoggedIn.mount(container);
      LoggedIn.update({ user: state.user });
    } else {
      LoggedIn.unmount();
      LoginForm.mount(container);
    }
  }

  test("initial render shows LoginForm", () => {
    renderApp(appState.get());

    expect(container.innerHTML).toContain("Log In");
    expect(LoginForm._mountSpy).toHaveBeenCalledTimes(1);
    expect(LoginForm._destroySpy).toHaveBeenCalledTimes(0);
    expect(LoggedIn._mountSpy).toHaveBeenCalledTimes(0);
    expect(LoggedIn._destroySpy).toHaveBeenCalledTimes(0);
  });

  test("clicking login switches to LoggedIn and lifecycle fires", () => {
    renderApp(appState.get());
    LoginForm._mountSpy.mockClear();
    LoginForm._destroySpy.mockClear();
    LoggedIn._mountSpy.mockClear();
    LoggedIn._destroySpy.mockClear();

    const loginBtn = container.querySelector("#login");
    loginBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // After state change, re-render app
    renderApp(appState.get());

    expect(container.innerHTML).toContain("Welcome, Tester!");
    expect(LoginForm._destroySpy).toHaveBeenCalledTimes(1);
    expect(LoggedIn._mountSpy).toHaveBeenCalledTimes(1);
  });

  test("destroy called when switching back to login", () => {
    appState.setState({ user: { name: "Tester" } });
    renderApp(appState.get());

    expect(container.innerHTML).toContain("Welcome, Tester!");

    appState.setState({ user: null });
    renderApp(appState.get());
    setTimeout(() => {
      expect(container.innerHTML).toContain("Log In");
      expect(LoggedIn._destroySpy).toHaveBeenCalledTimes(1);
      expect(LoginForm._mountSpy).toHaveBeenCalledTimes(2); // mounted initially + after logout
    }, 0);
  });
});
