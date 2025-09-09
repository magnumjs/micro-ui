import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';
import { Layout } from "./comps/Layout.js";
import { Home } from "./pages/Home.js";
import { GettingStarted } from "./pages/GettingStarted.js";
import { API } from "./pages/Api.js";
import { Docs } from "./pages/Docs.js";
import { Examples } from "./pages/Examples.js";
import { CounterExample } from "./pages/examples/Counter.js";

const routes = {
  "/": Home,
  "/getting-started": GettingStarted,
  "/api": API,
  "/docs": Docs,
  "/examples": Examples,
  "/examples/counter": CounterExample,
};

const App = createComponent({
  state: {
    page: routes[location.hash.slice(1)] || Home,
  },
  render: function () {
    return Layout({
      brand: "MicroUI Docs",
      navLinks: [
        { href: "#/", label: "Home" },
        { href: "#/getting-started", label: "Getting Started" },
        { href: "#/api", label: "API" },
        { href: "#/examples", label: "Examples" },
      ],
      sidebarItems: [
        { href: "#/getting-started", label: "Getting Started" },
        {
          href: "#/api",
          label: "API",
          children: [{ href: "#/docs", label: "Docs" }],
        },
        {
          href: "#/examples",
          label: "Examples",
          children: [{ href: "#/examples/counter", label: "Counter Example" }],
        },
      ],
      page: this.state.page,
      footerText: "MicroUI Docs – Built with Bootstrap",
    });
  },

  onMount() {
    window.addEventListener("hashchange", () => {
      this.setState({ page: routes[location.hash.slice(1)] || Home });
    });
  },
});

App.mount(document.getElementById("app"));
