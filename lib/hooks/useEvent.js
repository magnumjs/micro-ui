import { useCurrentComponent } from "../reactive-core.js";

export function useEvent() {
  const component = useCurrentComponent();
  if (!component) throw new Error("useEvent must be inside render()");

 function makeChainable(refId) {
    const api = {
      on(event, handler) {
        component.addEvent(`${event} [data-ref=${refId}]`, handler);
        return api; // allow chaining
      },
      onClick(fn) { return this.on("click", fn); },
      onBlur(fn)  { return this.on("blur", fn); },
      onInput(fn) { return this.on("input", fn); },
      onChange(fn){ return this.on("change", fn); },
      onFocus(fn) { return this.on("focus", fn); },
      onSubmit(fn){ return this.on("submit", fn); },
      toString() { return `data-ref="${refId}"`; }
    };
    return api;
  }

  function makeSingle(event) {
    return (handler) => {
      const refId = `h${component._renderIndex++}`;
      component.addEvent(`${event} [data-ref=${refId}]`, handler);
      return makeChainable(refId); // return chainable object
    };
  }

  return {
    onClick: makeSingle("click"),
    onBlur:  makeSingle("blur"),
    onInput: makeSingle("input"),
    onChange:makeSingle("change"),
    onFocus: makeSingle("focus"),
    onSubmit:makeSingle("submit"),
    on:      (event, fn) => makeSingle(event)(fn),
  };
}
