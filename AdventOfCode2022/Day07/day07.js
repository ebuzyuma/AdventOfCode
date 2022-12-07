const utils = require("../utils");
const lines = utils.readInput(__dirname);

let root = { name: "/", folders: {}, files: [] };
let currentDir = root;
for (let i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (line.startsWith("$ cd")) {
    const cd = line.split(" ")[2];
    if (cd === "/") {
      currentDir = root;
    } else if (cd === "..") {
      currentDir = currentDir.parent;
    } else {
      currentDir.folders[cd] = currentDir.folders[cd] || {
        parent: currentDir,
        name: cd,
        folders: {},
        files: [],
      };
      currentDir = currentDir.folders[cd];
    }
  } else if (line.startsWith("dir")) {
    const dir = line.split(" ")[1];
    currentDir.folders[dir] = { parent: currentDir, name: dir, folders: {}, files: [] };
  } else if (line !== "$ ls") {
    const [size, name] = line.split(" ");
    currentDir.files.push({ size: +size, name });
  }
}

const sizeFolders = (dir, sizeLimit, out = []) => {
  let dirs = [];
  dir.size = 0;
  if (Object.entries(dir.folders).length > 0) {
    for (const [dirName, value] of Object.entries(dir.folders)) {
      let subDirs = sizeFolders(value, sizeLimit, out);
      dir.size += value.size;
      dirs = [...dirs, ...subDirs];
    }
  }

  dir.size += dir.files.reduce((r, v) => r + v.size, 0);

  if (dir.size <= sizeLimit) {
    out.push(dir);
  }

  dirs.push(dir);
  return dirs;
};

const part1 = [];
const dirs = sizeFolders(root, 100000, part1);
const sum = part1.reduce((r, v) => r + v.size, 0);

console.log(sum);

const fs = 70000000;
const r = 30000000;
const toFree = root.size - (fs - r);

dirs.sort((a, b) => a.size - b.size);
let i = 0;
while (dirs[i].size < toFree) {
  i++;
}

console.log(dirs[i]);
