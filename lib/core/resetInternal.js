// Resets internal state of a component instance
export function resetInternal(api, originalInitialState, refs) {
  api._mountedChildren.forEach((child) => {
    if (child && typeof child.unmount === "function") {
      child.unmount();
    }
  });
  api._mountedChildren = [];
  refs._cachedNode = null;
  refs._renderedNull = false;
  refs.el = null;
  refs.mounted = false;
  refs.onBeforeMountDone = false;
  refs.boundEvents = [];
  refs.props = {};
  refs.prevProps = {};
  refs.state = { ...originalInitialState };
}
