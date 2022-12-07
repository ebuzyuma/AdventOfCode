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
      currentDir = currentDir.folders[cd];
    }
  } else if (line.startsWith("dir")) {
    const dir = line.split(" ")[1];
    currentDir.folders[dir] = { parent: currentDir, name: dir, folders: {}, files: [] };
  } else if (line !== "$ ls") { // line with a file 
    const [size, name] = line.split(" ");
    currentDir.files.push({ size: +size, name });
  }
}

const sizeFolders = (dir, sizeLimit, out = []) => {
  let allFolders = [];
  dir.size = 0;
  if (Object.entries(dir.folders).length > 0) {
    for (const [_, value] of Object.entries(dir.folders)) {
      let allSubFolders = sizeFolders(value, sizeLimit, out);
      dir.size += value.size;
      allFolders = [...allFolders, ...allSubFolders];
    }
  }

  dir.size += dir.files.reduce((r, v) => r + v.size, 0);

  if (dir.size <= sizeLimit) {
    out.push(dir);
  }

  allFolders.push(dir);
  return allFolders;
};

const limited = [];
const allFolders = sizeFolders(root, 100000, limited);
const part1 = limited.reduce((r, v) => r + v.size, 0);

console.log(part1);

const fsSize = 70000000;
const updateSize = 30000000;
const toFree = root.size - (fsSize - updateSize);

allFolders.sort((a, b) => a.size - b.size);
let i = 0;
while (allFolders[i].size < toFree) {
  i++;
}

console.log(allFolders[i].size);
