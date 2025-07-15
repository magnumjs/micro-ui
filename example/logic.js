import { appState } from './state.js';

export function fetchUser() {
  setTimeout(() => {
    appState.setState({ user: { name: 'Tova', email: "tova@me.com" } });
  }, 500);
}

export function loginUser(name) {
  console.log("Logging in user:", name);
  appState.setState({ user: { name } });
}

export function logoutUser() {
  appState.setState({ user: null });
}
