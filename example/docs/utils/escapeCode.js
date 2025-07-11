export function escapeCode(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
