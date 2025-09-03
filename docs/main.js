import { WelcomeCard } from "./components/WelcomeCard.js";
import { Counter } from "./components/Counter.browser.js";
import { AuthCard } from "./components/AuthCard.js";
// import { appState } from "./state.js";
import { fetchUser, loginUser, logoutUser } from "./logic.js";
import ShowHide from "./components/ShowHide.js";
import { initTodoList } from "./components/TodoList.init.js";
import { showCounterDemo, showTodoDemo } from './examples.js';
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { DocsSection } from "./components/sections/Docs.js";
import { GettingStarted } from "./components/sections/GettingStarted.js";
import { ApiSection } from "./components/sections/Api.js";
import { CreateComponentSection } from "./components/sections/CreateComponent.js";
import { CounterExampleSection } from "./components/sections/CounterExample.js";
import { TodoListExampleSection } from "./components/sections/TodoListExample.js";
import { ApiHooksSection } from "./components/sections/ApiHooks.js";
import { TogglerExampleSection } from "./components/sections/TogglerExample.js";
import { PdfGuidesSection } from "./components/sections/PdfGuidesSection.js";
import { LoginMessageExampleSection } from "./components/sections/LoginMessageExample.js";

document.addEventListener("DOMContentLoaded", () => {
  // ...existing code...
  // Render the correct section on initial load (after all setup)
  setTimeout(() => {
    const initialSection = location.hash.replace('#', '') || 'getting-started';
    showSection(initialSection);
    Prism.highlightAllUnder(document);
  }, 0);
  // Listen for hash changes to support browser navigation
  window.addEventListener('hashchange', () => {
    const section = location.hash.replace('#', '') || 'getting-started';
    showSection(section);
    // Re-render sidebar to update active indicator
    SidebarNav.mount(document.querySelector('.sidebar'));
  });
  // Delegate navigation clicks inside content-area
  document.getElementById('content-area').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-section]');
    if (link) {
      const section = link.dataset.section;
      if (section) {
        window.location.hash = `#${section}`;
        e.preventDefault();
      }
    }
  });
  // AuthCard.mount("#auth");

  // // WelcomeCard
  // // WelcomeCard
  // WelcomeCard.mount("#examples");

  // // Subscribe to state changes
  // appState.subscribe((state) => {
  //   console.log("State changed:", state);
  //   WelcomeCard.update({ user: state.user });
  //   AuthCard.update({
  //     user: state.user,
  //     onLogin: loginUser,
  //     onLogout: () => {
  //       logoutUser();
  //       console.log("Logged out! from subscription");
  //     },
  //   });
  // });

  // // Initial state
  // Counter.mount("#counter");
  // Counter.update({ count: 0 });

  // fetchUser();
  // initTodoList("#todos");

  // ShowHide.mount("#message");
  // ShowHide.update({ showMessage: true });

  // const root = document.getElementById('docs-root');

  // Top navigation (no duplicate links)
  const TopNav = createComponent(() => `
    <a href="./" style="text-decoration:none;color:inherit;">
      <h1>🧩 Micro Reactive UI Library Docs</h1>
    </a>
    <nav>
      <ul class="docs-nav">
  <li><a href="#getting-started" data-section="getting-started">Getting Started</a></li>
  <li><a href="#docs" data-section="docs">Docs</a></li>
  <li><a href="#api" data-section="api">API</a></li>
  <!-- Advanced Usage removed from top nav -->
      </ul>
    </nav>
  `, {
    on: {
      "click *": (ctx) => {
        const section = ctx.event.target.dataset.section;
        if (section) {
          console.log('TopNav clicked:', section);
          window.location.hash = `#${section}`;
        }
      }
    }
  });
  // Render top nav directly as HTML to preserve horizontal layout
  TopNav.mount(document.querySelector('.docs-header'));

  // Central content area strategy: separate containers for each section
  const contentArea = document.getElementById('content-area');
  const sectionIds = ['getting-started', 'docs', 'api-createComponent', 'api', 'counter', 'todo-list', 'api-hooks', 'toggler-example', 'login-message-example', 'pdf-guides'];
  const sectionComponents = {
    'getting-started': GettingStarted,
    'docs': DocsSection,
    'api': ApiSection,
    'api-createComponent': CreateComponentSection,
    'counter': CounterExampleSection,
    'todo-list': TodoListExampleSection,
    'api-hooks': ApiHooksSection,
    'toggler-example': TogglerExampleSection,
    'login-message-example': LoginMessageExampleSection,
    'pdf-guides': PdfGuidesSection
  };
  // Create and mount each section container once
  sectionIds.forEach(id => {
    const div = document.createElement('div');
    div.id = `section-${id}`;
    div.style.display = 'none';
    contentArea.appendChild(div);
    const comp = sectionComponents[id];
    if (comp) comp.mount(div);
  });
  // Function to show/hide sections
  function renderSection(sectionId) {
    let found = false;
    sectionIds.forEach(id => {
      const div = document.getElementById(`section-${id}`);
      if (div) {
        if (id === sectionId) {
          div.style.display = '';
          found = true;
        } else {
          div.style.display = 'none';
        }
      }
    });
    // If not found, hide all and show Not Found message
    if (!found) {
      sectionIds.forEach(id => {
        const div = document.getElementById(`section-${id}`);
        if (div) div.style.display = 'none';
      });
      // Only add Not Found message if not already present
      let notFound = document.getElementById('section-not-found');
      if (!notFound) {
        notFound = document.createElement('div');
        notFound.id = 'section-not-found';
        notFound.style.padding = '2em';
        notFound.style.textAlign = 'center';
        notFound.style.color = '#888';
        notFound.textContent = 'Section not found.';
        contentArea.appendChild(notFound);
      } else {
        notFound.style.display = '';
      }
    } else {
      // Hide Not Found message if present
      const notFound = document.getElementById('section-not-found');
      if (notFound) notFound.style.display = 'none';
    }
  }
  // Sidebar navigation using micro-ui with sections
  const SidebarNav = createComponent(({state}) => `
    <div>
      <h3>📚 Navigation</h3>
      <ul>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#getting-started" data-section="getting-started" style="flex:1;">🚀 Getting Started</a>${location.hash === '#getting-started' ? '<span class="nav-active-circle"></span>' : ''}</li>
      </ul>
      <hr />
  <h4><a href="#pdf-guides" data-section="pdf-guides" id="pdf-guides-link" style="text-decoration:none;color:inherit;cursor:pointer;">PDF Guides</a></h4>
      <hr />
      <h4>Examples</h4>
      <ul>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#counter" data-section="counter" style="flex:1;">🧮 Counter</a>${location.hash === '#counter' ? '<span class="nav-active-circle"></span>' : ''}</li>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#todo-list" data-section="todo-list" style="flex:1;">✅ TodoList</a>${location.hash === '#todo-list' ? '<span class="nav-active-circle"></span>' : ''}</li>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#toggler-example" data-section="toggler-example" style="flex:1;">🔀 Toggler</a>${location.hash === '#toggler-example' ? '<span class="nav-active-circle"></span>' : ''}</li>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#login-message-example" data-section="login-message-example" style="flex:1;">🔑 Login Message</a>${location.hash === '#login-message-example' ? '<span class="nav-active-circle"></span>' : ''}</li>
      </ul>
      <hr />
      <h4>API Docs</h4>
      <ul>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#api" data-section="api" style="flex:1;">Core API</a>${location.hash === '#api' ? '<span class="nav-active-circle"></span>' : ''}</li>
        <li style="position:relative;display:flex;align-items:center;"> <a href="#api-hooks" data-section="api-hooks" style="flex:1;">Compose Hooks</a>${location.hash === '#api-hooks' ? '<span class="nav-active-circle"></span>' : ''}</li>
      </ul>
      <hr />
      <h4>Project</h4>
      <ul>
        <li><a href="https://github.com/magnumjs/micro-ui" target="_blank">GitHub Homepage</a></li>
      </ul>
    </div>
  `, {
    on: {
      "click *": (ctx) => {
        const section = ctx.event.target.dataset.section;
        if (section) {
          ctx.setState({section})
          window.location.hash = `#${section}`;
          ctx.event.preventDefault();
          // Re-render sidebar immediately after click
          SidebarNav.mount(document.querySelector('.sidebar'));
        }
      }
    }
  });
  // Render sidebar nav directly as HTML
  SidebarNav.mount(document.querySelector('.sidebar'));

  // Modular docs section logic
  function showSection(sectionId) {
    // Always show docs section for advanced usage steps
    if (sectionId.startsWith('advanced-usage')) {
      renderSection('docs');
      setTimeout(() => {
        // Only trigger click for step 1
        if (sectionId === 'advanced-usage') {
          const showAdvanced = document.getElementById('show-advanced-usage');
          if (showAdvanced) showAdvanced.click();
        }
        // DocsSection will handle stepper for other hashes
      }, 0);
      return;
    }
    // If navigating to advanced-usage, always show docs section
    if (sectionId === 'advanced-usage') {
      renderSection('docs');
      setTimeout(() => {
        const showAdvanced = document.getElementById('show-advanced-usage');
        if (showAdvanced) showAdvanced.click();
      }, 0);
      return;
    }
    // Fix: treat api-hooks-step-* as api-hooks for stepper navigation
    if (sectionId.startsWith('api-hooks-step-')) {
      renderSection('api-hooks');
      return;
    }
    renderSection(sectionId);
  }

});
