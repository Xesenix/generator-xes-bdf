const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

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

const getIgnoredPaths = async () => {
  const { data } = await axios.get('https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore');

  return data + `
# xes-bdf build directory
dist/
`;
}

module.exports.getIgnoredPaths = getIgnoredPaths;
