const { scrape } = require('./scraper');
const { fetchAndUnzip } = require('./unzipperFetcher');
const { parse } = require('./csvParser');
const logger = require('./logger');
const { clean } = require('./cleanUp');
const cache = require('./cache').get();

const key = 'rates';
const fetchRates = async () => {
  try {
    logger.info('Check if value cached');
    const rates = cache.get(key);
    if (rates) {
      logger.info('Cache hit! Returning...');
      return rates;
    }
    logger.info('Cache miss! Retrieving data...');

    const url = await scrape();
    const file = await fetchAndUnzip(url);
    const json = await parse(file);
    clean();
    logger.info('Historical rates fetched successfully');

    cache.set(key, json);

    return json;
  } catch (err) {
    logger.warn('An error occured when fetching ECB rates');
    logger.warn(err.message);
    throw err;
  }
};

module.exports = { fetchRates };
