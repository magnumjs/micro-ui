import { createComponent } from "../lib/reactive-core.js";
import { Message } from "./Message.js";

const ShowHide = createComponent(
  ({ showMessage }) => `
    <div>
      <div id="msg-area">
        ${Message.render({ visible: showMessage }) ?? ""}
      </div>
      <button id="toggle-btn">Toggle Message</button>
      <p>Click the button to show/hide the message.</p>
    </div>
  `,
  {
    events: {
      "click #toggle-btn": function () {
        const next = !this.props.showMessage;
        this.update({ showMessage: next });
      },
    },
  }
);

export default ShowHide;
