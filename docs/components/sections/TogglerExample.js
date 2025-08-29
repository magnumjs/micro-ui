import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";


// const [getCartVisible, setCartVisible] = setState([true, true, true, true]);

// const Toggler = createComponent(({ index }) => {
//   effect(() => {
//     // Log visibility changes for demo
//     console.log('Cart', index, 'visible:', getCartVisible()[index]);
//   }, [getCartVisible()[index]]);
//   function toggle() {
//     const vis = getCartVisible().slice();
//     vis[index] = !vis[index];
//     setCartVisible(vis);
//   }
//   if (!getCartVisible()[index]) return null;
//   return `<div class="cart" data-comp="cart" id="cart-${index}">
//     <h4>Cart ${index + 1}</h4>
//     <button type="button" class="toggle-btn">Toggle</button>
//     <div>Shared Value: ${getCartVisible()[index]}</div>
//   </div>`;
// });

const TogglerWidget = createComponent(() => {
  return `<div class="toggler-widget">
    <div class="column">${[0,1].map(i => Toggler({ index: i })).join('')}</div>
    <div class="column">${[2,3].map(i => Toggler({ index: i })).join('')}</div>
  </div>`;
});

// Step-by-step code lines for Toggler example


const codeLines = [
  "// 1. Create a shared value for cart visibility (array of booleans)",
  "const cartVisible = value([true, true, true, true]);",
  "// 2. Toggler component: toggles visibility of a cart by index",
  "const Toggler = createComponent(({ index }) => {",
  "  // 3. Use effect to log visibility changes for this cart",
  "  effect(() => {",
  "    console.log('Cart', index, 'visible:', cartVisible.get()[index]);",
  "  }, [cartVisible.get()[index]]);",
  "  // 4. Toggle handler updates shared value",
  "  function toggle() {",
  "    const vis = cartVisible.get().slice();",
  "    vis[index] = !vis[index];",
  "    cartVisible.set(vis);",
  "  }",
  "  // 5. If not visible, return null (component is hidden)",
  "  if (!cartVisible.get()[index]) return null;",
  "  // 6. Render cart UI with toggle button",
  "  return '<div class=\"cart\" data-comp=\"cart\" id=\"cart-' + index + '\">' +",
  "    '<h4>Cart ' + (index + 1) + '</h4>' +",
  "    '<button type=\"button\" class=\"toggle-btn\">Toggle</button>' +",
  "    '<div>Shared Value: ' + cartVisible.get()[index] + '</div>' +",
  "    '</div>';",
  "});",
  "// 7. Main widget: renders two columns of carts, sharing state",
  "const TogglerWidget = createComponent(() => {",
  "  return '<div class=\"toggler-widget\">' +",
  "    '<div class=\"column\">' + [0,1].map(i => Toggler({ index: i })).join('') + '</div>' +",
  "    '<div class=\"column\">' + [2,3].map(i => Toggler({ index: i })).join('') + '</div>' +",
  "    '</div>';",
  "});",
  "// 8. Mount the widget in the live demo area",
  "TogglerWidget.mount('#toggler-demo');"
];

// Step explanations
const explanations = [
  "Create a shared reactive value to track visibility for each cart.",
  "Initialize the value with all carts visible.",
  "Define a Toggler component that receives a cart index.",
  "Use the effect hook to log visibility changes for this cart.",
  "Effect runs whenever the visibility of this cart changes.",
  "Define a toggle handler to update the shared visibility value.",
  "Copy the array, toggle the value for this cart, and update the shared state.",
  "If the cart is not visible, return null to hide the component.",
  "Render the cart UI with a toggle button and show the shared value.",
  "Close the Toggler component definition.",
  "Create a main widget that renders two columns of carts, sharing the state.",
  "Render two columns, each with two carts, using the shared value.",
  "Close the TogglerWidget component definition.",
  "Mount the widget in the live demo area for live interaction."
];

export const TogglerExampleSection = createComponent(() => {
  return `<section class="toggler-example-section" style="padding:2em;text-align:center;color:#888;font-size:1.5em;">
    Section not found 404
  </section>`;
});
