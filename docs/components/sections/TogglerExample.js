import { createComponent, useSharedState, effect } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.all.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";



const Card = createComponent({
  render() {
    return `
      <div class="card">
        <h3>${this.props.title}</h3>
        <p>Total: $${this.props.total}</p>
        <button data-action-click="removeMe">Remove</button>
      </div>
    `;
  },

  removeMe() {
    // Tell parent we want to be removed
    // Directly call the parent function
    if (typeof this.props.remove === "function") {
      this.props.remove(this.props.id);
    }
    //this.emit("remove", this.props.id);
  }
});

const TogglerWidget = createComponent({
  state: {
    cards: [
      { id: 1, title: "Card 1", total: 2 },
      { id: 2, title: "Card 2", total: 5 },
      { id: 3, title: "Card 3", total: 0 }
    ]
  },

  render() {
    return `
      <div>
        <button data-action-click="addCard">Add Card</button>
        <div class="cards" data-ref="cards">
          ${this.state.cards.map(card =>
            Card({
              key: card.id,
              id: card.id,
              title: card.title,
              total: card.total,
              remove: (id) => {
                 TogglerWidget.removeCard(id);
              }
            })
          ).join("")}
        </div>
      </div>
    `;
  },

  addCard() {
    const nextId = this.state.cards.length
      ? Math.max(...this.state.cards.map(c => c.id)) + 1
      : 1;

    this.setState({
      cards: [
        ...this.state.cards,
        { id: nextId, title: `Card ${nextId}`, total: 0 }
      ]
    });
  },

  removeCard(id) {
    this.setState({
      cards: this.state.cards.filter(card => card.id !== id)
    });
  }
});



// Step-by-step code lines for Toggler example


const codeLines = [
  "// 1. Define a Card component that displays card info and a remove button",
  "const Card = createComponent({",
  "  render() {",
  "    return `",
  "      <div class=\"card\">",
  "        <h3>${this.props.title}</h3>",
  "        <p>Total: $${this.props.total}</p>",
  "        <button data-action-click=\"removeMe\">Remove</button>",
  "      </div>",
  "    `;",
  "  },",
  "  removeMe() {",
  "    if (typeof this.props.remove === \"function\") {",
  "      this.props.remove(this.props.id);",
  "    }",
  "  }",
  "});",
  "",
  "// 2. Define TogglerWidget to manage a list of cards",
  "const TogglerWidget = createComponent({",
  "  state: {",
  "    cards: [",
  "      { id: 1, title: \"Card 1\", total: 2 },",
  "      { id: 2, title: \"Card 2\", total: 5 },",
  "      { id: 3, title: \"Card 3\", total: 0 }",
  "    ]",
  "  },",
  "  render() {",
  "    return `",
  "      <div>",
  "        <button data-action-click=\"addCard\">Add Card</button>",
  "        <div class=\"cards\" data-ref=\"cards\">",
  "          ${this.state.cards.map(card =>",
  "            Card({",
  "              key: card.id,",
  "              id: card.id,",
  "              title: card.title,",
  "              total: card.total,",
  "              remove: (id) => {",
  "                 TogglerWidget.removeCard(id);",
  "              }",
  "            })",
  "          ).join(\"\")}",
  "        </div>",
  "      </div>",
  "    `;",
  "  },",
  "  addCard() {",
  "    const nextId = this.state.cards.length",
  "      ? Math.max(...this.state.cards.map(c => c.id)) + 1",
  "      : 1;",
  "    this.setState({",
  "      cards: [",
  "        ...this.state.cards,",
  "        { id: nextId, title: `Card ${nextId}`, total: 0 }",
  "      ]",
  "    });",
  "  },",
  "  removeCard(id) {",
  "    this.setState({",
  "      cards: this.state.cards.filter(card => card.id !== id)",
  "    });",
  "  }",
  "});"
];

const explanations = [
  "Define a Card component that displays a title, total, and a remove button.",
  "The Card's removeMe method calls the parent remove function with its id.",
  "Define TogglerWidget with a state containing an array of card objects.",
  "The render method outputs a button to add cards and a list of Card components.",
  "Each Card receives props including a remove callback that calls TogglerWidget.removeCard.",
  "The addCard method computes the next id and adds a new card to the state.",
  "The removeCard method filters out the card with the given id from the state.",
  "All UI updates are handled reactively via setState and props."
];

export const TogglerExampleSection = createComponent(() => {
  // Mount the live widget after render
  setTimeout(() => {
    if (document.getElementById('toggler-demo')) {
      TogglerWidget.mount('#toggler-demo');
    }
  }, 0);
  const finalCode = [
    'const Card = createComponent({',
    '  render() {',
    '    return `',
    '      <div class="card">',
    '        <h3>${this.props.title}</h3>',
    '        <p>Total: $${this.props.total}</p>',
    '        <button data-action-click="removeMe">Remove</button>',
    '      </div>',
    '    `;',
    '  },',
    '',
    '  removeMe() {',
    '    if (typeof this.props.remove === "function") {',
    '      this.props.remove(this.props.id);',
    '    }',
    '  }',
    '});',
    '',
    'const TogglerWidget = createComponent({',
    '  state: {',
    '    cards: [',
    '      { id: 1, title: "Card 1", total: 2 },',
    '      { id: 2, title: "Card 2", total: 5 },',
    '      { id: 3, title: "Card 3", total: 0 }',
    '    ]',
    '  },',
    '',
    '  render() {',
    '    return `',
    '      <div>',
    '        <button data-action-click="addCard">Add Card</button>',
    '        <div class="cards" data-ref="cards">',
    '          ${this.state.cards.map(card =>',
    '            Card({',
    '              key: card.id,',
    '              id: card.id,',
    '              title: card.title,',
    '              total: card.total,',
    '              remove: (id) => {',
    '                 TogglerWidget.removeCard(id);',
    '              }',
    '            })',
    '          ).join("")}',
    '        </div>',
    '      </div>',
    '    `;',
    '  },',
    '',
    '  addCard() {',
    '    const nextId = this.state.cards.length',
    '      ? Math.max(...this.state.cards.map(c => c.id)) + 1',
    '      : 1;',
    '',
    '    this.setState({',
    '      cards: [',
    '        ...this.state.cards,',
    '        { id: nextId, title: `Card ${nextId}`, total: 0 }',
    '      ]',
    '    });',
    '  },',
    '',
    '  removeCard(id) {',
    '    this.setState({',
    '      cards: this.state.cards.filter(card => card.id !== id)',
    '    });',
    '  }',
    '});'
  ].join('\n');
  return `
    <section class="toggler-example-section" style="padding:2em;max-width:700px;margin:auto;">
      <h2>🔀 Toggler Live Example</h2>
      <div id="toggler-demo" style="margin-bottom:2em;"></div>
      <h3>Step-by-Step Code</h3>
      <ol style="text-align:left;">
        ${codeLines.map((line, i) => `<li><pre class="line-numbers language-js"><code class="language-js">${escapeCode(line)}</code></pre><div>${explanations[i] || ''}</div></li>`).join('')}
      </ol>
      <h3>Final Implementation</h3>
      <pre class="line-numbers language-js" style="background:#f4f4f4;padding:1em;border-radius:6px;"><code class="language-js">${escapeCode(finalCode)}</code></pre>
    </section>
  `;
});
