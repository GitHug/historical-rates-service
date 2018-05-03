const unzipper = require('unzipper');
const rp = require('request');
const logger = require('./logger');

const fetchAndUnzip = async (url) => {
  logger.info(`Preparing to fetch url ${url} and unzip`);

  let fname;
  const promise = new Promise((resolve, reject) => {
    rp({ url })
      .pipe(unzipper.Extract({ path: 'data' }))
      .on('entry', (file) => {
        fname = file.path;
      })
      .on('error', (e) => {
        logger.warn(e);
        reject(e);
      })
      .on('finish', () => {
        if (fname) {
          logger.info('File completed successfully');
          resolve(`./data/${fname}`);
        }
      });
  });

  return promise;
};

module.exports = { fetchAndUnzip };
