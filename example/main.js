import { WelcomeCard } from "./components/WelcomeCard.js";
import { Counter } from "./components/Counter.browser.js";
import { AuthCard } from "./components/AuthCard.js";
import { appState } from "./state.js";
import { fetchUser, loginUser, logoutUser } from "./logic.js";
import ShowHide from "./components/ShowHide.js";
import { initTodoList } from "./components/TodoList.init.js";

document.addEventListener("DOMContentLoaded", () => {
AuthCard.mount('#auth');

  // WelcomeCard
  // WelcomeCard
  WelcomeCard.mount("#examples");


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
Counter.mount('#counter');
Counter.update({ count: 0 });

    fetchUser();
 initTodoList('#todos');

  ShowHide.mount("#message");
  ShowHide.update({ showMessage: true }); 

});

