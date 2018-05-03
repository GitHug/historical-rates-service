const fs = require('fs');
const logger = require('./logger');

const dir = './data';

const deleteFolderRecursive = (path, arr) => {
  const f = {
    path,
    files: [],
    folders: [],
  };

  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        f.folders.push(curPath);
        deleteFolderRecursive(curPath, arr);
      } else { // delete file
        f.files.push(file);
        fs.unlinkSync(curPath);
      }
    });
    arr.push(f);
    fs.rmdirSync(path);
  }
};

const clean = () => {
  const cleaned = [];
  try {
    logger.info('Preparing to clean up...');
    deleteFolderRecursive(dir, cleaned);
    logger.info('Clean up successful');
    logger.info(`Removed: ${JSON.stringify(cleaned)}`);
  } catch (err) {
    logger.warn('Failed to clean up');
    logger.warn(err);
  }

  return cleaned;
};

module.exports = { clean };
