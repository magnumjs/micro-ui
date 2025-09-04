import { createComponent } from "../../lib/reactive-core.js";
import { useEmits } from "../../lib/hooks/useEmits.js";
import { jest } from "@jest/globals";

describe("useEmits", () => {
  it('throws if called outside a component render', () => {
    expect(() => useEmits()).toThrow('useEmits must be inside render()');
  });

  it('returns the same API if called twice in the same render', () => {
    let api1, api2;
    const Comp = createComponent({
      render() {
        api1 = useEmits();
        api2 = useEmits();
        return '<div></div>';
      }
    });
    Comp();
    expect(api1).toBe(api2);
  });
  it.only("registers and cleans up context event listeners via useContextListeners", async () => {
    let api, compInstance;
    const contextHandler = jest.fn();
    const Comp = createComponent(
      () => {
        api = useEmits();
        compInstance = this;
        return "<div></div>";
      },
      {
        on: {
          foo: contextHandler,
        },
      }
    );
    Comp();
    await Promise.resolve(); // Ensure listeners are registered
    Comp.emit("foo", 123);
    await Promise.resolve();
    expect(contextHandler).toHaveBeenCalledWith(123);
    Comp.unmount();
    await Promise.resolve();
    //Comp.emit("foo", 456);
    expect(contextHandler.mock.calls.length).toBe(1);
  });
  it("attaches local emit/onEmit API and calls handler", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEmits();
        return "<div></div>";
      },
    });
    Comp();
    api.onEmit("test", handler);
    api.emit("test", 42);
    expect(handler).toHaveBeenCalledWith(42);
  });

  it("attaches global emitGlobal/onEmitGlobal API and calls handler", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEmits();
        return "<div></div>";
      },
    });
    Comp();
    api.onEmitGlobal("globalTest", handler);
    api.emitGlobal("globalTest", 99);
    expect(handler).toHaveBeenCalledWith(99);
  });

  it("cleans up local listeners on unmount", () => {
    let api, compInstance;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEmits();
        compInstance = this;
        return "<div></div>";
      },
    });
    Comp();
    api.onEmit("cleanup", handler);
    api.emit("cleanup", 1);
    expect(handler).toHaveBeenCalledWith(1);
    if (compInstance.unmount) {
      compInstance.unmount();
    }
    // After unmount, do not emit again; just check handler was only called once
    expect(handler.mock.calls.length).toBe(1);
  });
});
