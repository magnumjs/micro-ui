// Helper to merge new props, update prevProps, and sync api.props
// Usage: ({props, prevProps, api, newProps}) => ({props, prevProps})
export function mergeAndSyncProps({ props, prevProps, api, newProps }) {
  props = { ...props, ...newProps };
  prevProps = { ...props };
  api.props = props;
  return { props, prevProps };
}