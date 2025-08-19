import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { Card } from "./Card.js";
import { LoginForm } from "./LoginForm.js";
import { LoggedIn } from "./LoggedIn.js";

export const AuthCard = createComponent(
  ({ props: {user, onLogin, onLogout} }) => {
    const children = user
      ? LoggedIn.render({ user, onLogout }) +
        `<button id="logout" style="margin-top: 1rem;">Log Out</button>`
      : LoginForm.render();

    return Card.render({
      title: user ? "Welcome Back" : "Please Log In",
      children, // this gets slotted into Card
    });
  },
  {
    on: {
      "click #logout": function () {
        this.props.onLogout?.();
      },
      "submit #login-form": function ({event}) {
        console.log("Login form submitted",this.el );
        event.preventDefault();
        const usernameInput = this.el.querySelector("#username");
        const passwordInput = this.el.querySelector("#password");
        console.log(
          "Login form submitted with:",
          usernameInput?.value,
          passwordInput?.value
        );
        if (usernameInput?.value && passwordInput?.value) {
          console.log("Logging in user:", usernameInput.value, this.props);
          this.props.onLogin?.(usernameInput.value);
        }
      },
    },
  }
);
