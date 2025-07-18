import { createComponent } from "../lib/reactive-core";

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
    events: {
      "click #toggle-btn": function () {
        this.setState((prev) => ({ isOn: !prev.isOn }));
      },
    },
  }
);
