const fs = require('fs');
const path = require('path');

// Copy all files from dist/server to dist/client
const serverDir = path.join(__dirname, '../dist/server');
const clientDir = path.join(__dirname, '../dist/client');
const DEFAULT_ROUTE_SEGMENTS = ['(drawer)', '(home)', '(tabs)'];

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) {
    return;
  }

  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItem => {
      copyRecursive(
        path.join(src, childItem),
        path.join(dest, childItem)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function findPrimaryIndexHtml() {
  const preferredPath = path.join(clientDir, ...DEFAULT_ROUTE_SEGMENTS, 'index.html');
  if (fs.existsSync(preferredPath)) {
    return preferredPath;
  }

  let bestMatch = null;
  let bestScore = -1;

  function walk(dir) {
    if (!fs.existsSync(dir)) {
      return;
    }

    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        return;
      }

      if (!entry.isFile() || entry.name !== 'index.html') {
        return;
      }

      const relativePath = path.relative(clientDir, entryPath);
      const score = DEFAULT_ROUTE_SEGMENTS.reduce(
        (total, segment) => total + (relativePath.includes(segment) ? 10 : 0),
        0
      ) + relativePath.split(path.sep).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entryPath;
      }
    });
  }

  walk(clientDir);
  return bestMatch;
}

// Copy all server files to client
copyRecursive(serverDir, clientDir);

// Copy the main index.html to the root for proper routing
const rootIndexPath = path.join(clientDir, 'index.html');
const sourceIndexPath = findPrimaryIndexHtml();

if (sourceIndexPath) {
  fs.copyFileSync(sourceIndexPath, rootIndexPath);
  console.log(`[prepare-web-files] Copied ${path.relative(clientDir, sourceIndexPath)} to root index.html`);
} else {
  console.warn('[prepare-web-files] Could not locate the primary index.html. Root file was not updated.');
}

console.log('[prepare-web-files] Netlify build prepared: merged server and client directories');
