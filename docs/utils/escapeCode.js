export function escapeCode(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export 
// To unescape other common escape sequences (example: backslash, quotes)
function unescapeFunctionCode(escapedCode) {
  let unescapedCode = stringifiedObjectWithFunctions(escapedCode);

  // Replace common escape sequences
  unescapedCode = unescapedCode.replace(/\\n/g, '\n');
  unescapedCode = unescapedCode.replace(/\\t/g, '\t');
  unescapedCode = unescapedCode.replace(/\\\\/g, '\\');
  unescapedCode = unescapedCode.replace(/\\'/g, "'");
  unescapedCode = unescapedCode.replace(/\\"/g, '"');
  unescapedCode = unescapedCode.replace(/\\r/g, '\r');
  unescapedCode = unescapedCode.replace(/\\b/g, '\b');
  unescapedCode = unescapedCode.replace(/\\f/g, '\f');
  unescapedCode = unescapedCode.replace(/""/g, '"');
  unescapedCode = unescapedCode.replace(/}"/g, '}');

  // Handle Unicode escapes (more complex, might require parsing hex values)
  unescapedCode = unescapedCode.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return unescapedCode;
}


const stringifiedObjectWithFunctions = (myObject) =>
  JSON.stringify(
    myObject,
    (key, value) => {
      if (typeof value === "function") {
        // Convert the function to its string representation (source code)
        return value.toString();
      }
      return value; // Return other values as they are
    },
    2
  );