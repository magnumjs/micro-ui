import { WelcomeCard } from "./components/WelcomeCard.js";
import { Counter } from "./components/Counter.js";
import { AuthCard } from "./components/AuthCard.js";
import { appState } from "./state.js";
import { fetchUser, loginUser, logoutUser } from "./logic.js";
import { initTodoList } from "./components/TodoList.init.js";

document.addEventListener("DOMContentLoaded", () => {
AuthCard.mountTo('#auth');

  // WelcomeCard
  // WelcomeCard
  WelcomeCard.mountTo("#examples");


  // Subscribe to state changes
  appState.subscribe((state) => {
    console.log("State changed:", state);
    WelcomeCard.update({ user: state.user });
    AuthCard.update({
      user: state.user,
      onLogin: loginUser,
      onLogout: () => {
        logoutUser();
        console.log("Logged out! from subscription");
      },
    });
  });

  // Initial state
Counter.mountTo('#counter');
Counter.update({ count: 0 });

    fetchUser();
// initTodoList('#todos');


});

