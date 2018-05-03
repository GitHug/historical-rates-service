const { scrape } = require('./scraper');
const { fetchAndUnzip } = require('./unzipperFetcher');
const { parse } = require('./csvParser');
const logger = require('./logger');
const { clean } = require('./cleanUp');

const fetchRates = async () => {
  try {
    const url = await scrape();
    const file = await fetchAndUnzip(url);
    const json = await parse(file);
    clean();
    logger.info('Historical rates fetched successfully');
    return json;
  } catch (err) {
    logger.warn('An error occured when fetching ECB rates');
    logger.warn(err.message);
    throw err;
  }
};

module.exports = { fetchRates };
