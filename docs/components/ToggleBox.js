import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const ToggleBox = createComponent(
  function () {
    const isOn = this.state.isOn ?? false;
    return `
      <div>
        <p>Status: ${isOn ? "On" : "Off"}</p>
        <button id="toggle-btn">Toggle</button>
      </div>
    `;
  },
  {
    on: {
      "click #toggle-btn": function () {
        this.setState((prev) => ({ isOn: !prev.isOn }));
      },
    },
  }
);
