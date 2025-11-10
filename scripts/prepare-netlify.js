const fs = require('fs');
const path = require('path');

// Copy all files from dist/server to dist/client
const serverDir = path.join(__dirname, '../dist/server');
const clientDir = path.join(__dirname, '../dist/client');

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

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

// Copy all server files to client
copyRecursive(serverDir, clientDir);

console.log('✅ Netlify build prepared: merged server and client directories');