import CardWithFallbacks from "./CardWithFallbacks";

CardWithFallbacks.mountTo("#card-demo");

CardWithFallbacks.update({
  slots: {
    header: "<h1>🚀 Custom Title</h1>",
    default: "<p>This is custom body content.</p>",
    footer: "<button>Close</button>",
  },
});

// Want Just Header and Fallback Body?
/*
CardWithFallbacks.update({
  slots: {
    header: "<h1>Hello</h1>",
    // default: omitted
    // footer: omitted
  },
});

*/