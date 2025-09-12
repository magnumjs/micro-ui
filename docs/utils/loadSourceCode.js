// docs/utils/loadSourceCode.js

const _sourceCodeCache = {};

export async function loadSourceCode(filePath) {
  if (_sourceCodeCache[filePath]) {
    return _sourceCodeCache[filePath];
  }
  // For Node.js or server-side usage
  if (typeof require !== 'undefined') {
    const fs = require('fs');
    const code = await fs.promises.readFile(filePath, 'utf8');
    _sourceCodeCache[filePath] = code;
    return code;
  }
  // For browser usage, use fetch
  if (typeof fetch !== 'undefined') {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Failed to load source code: ' + filePath);
    const code = await response.text();
    _sourceCodeCache[filePath] = code;
    return code;
  }
  throw new Error('Unsupported environment for loading source code');
}
