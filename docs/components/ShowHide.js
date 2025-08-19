import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { Message } from "./Message.js";

const ShowHide = createComponent(
  ({ props:{showMessage} }) => `
    <div>
      <div id="msg-area">
        ${Message.render({ visible: showMessage }) ?? ""}
      </div>
      <button id="toggle-btn">Toggle Message</button>
      <p>Click the button to show/hide the message.</p>
    </div>
  `,
  {
    on: {
      "click #toggle-btn": function () {
        const next = !this.props.showMessage;
        this.update({ showMessage: next });
      },
    },
  }
);

export default ShowHide;
