const cheerio = require('cheerio');
const rp = require('request-promise');
const logger = require('./logger');

const selector = 'p:contains(Time series) + ul a.download';
const host = 'https://www.ecb.europa.eu';
const url = `${host}/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html`;

const scrape = async () => {
  logger.info(`Fetch link to file with selector '${selector}'`);

  const options = {
    uri: url,
    transform: body => cheerio.load(body),
  };

  const fileURL = await rp(options)
    .then(($) => {
      const link = $(selector);
      if (!link.attr('href')) {
        throw new Error(`Href not found with selector ${selector}`);
      }

      return host + link.attr('href');
    })
    .catch((err) => {
      logger.warn(`Unable to find file URL due to: ${err.message}`);
      throw err;
    });

  logger.info(`File URL is ${fileURL}`);
  return fileURL;
};

module.exports = { scrape };
