const path = require('path');
const _root = path.resolve(__dirname, '..');

module.exports = {
	logger(...filename) {
		return (...rest) => {
			console.log(...filename, ...rest);
		}
	},
	root(...args) {
		return path.join.apply(path, [_root, ...args]);
	},
};
