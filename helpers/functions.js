const fs = require('fs');
const path = require('path');
const axios = require('axios');

const listFiles = (dir, filelist = []) => {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);

		if (stat.isDirectory()) {
			filelist = listFiles(filepath, filelist);
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
