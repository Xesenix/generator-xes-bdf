const fs = require('fs').promises;
const path = require('path');

const listFiles = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (stat.isDirectory()) {
      filelist = await listFiles(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  }

  return filelist;
}

module.exports.listFiles = listFiles;
