const rewire = require('rewire');
const chai = require('chai');
const cap = require('chai-as-promised');

const fetchRates = rewire('../src/fetchRates');

chai.use(cap);
const { expect } = chai;

describe('fetchRates', () => {
  it('should be able to fetchRates without failing', async () => {
    const data = await fetchRates.fetchRates();
    expect(data.length).to.be.above(100);
  });

  describe('error handling', () => {
    let revert;

    before(() => {
      /* eslint-disable no-underscore-dangle */
      revert = fetchRates.__set__('scrape', async () => {
        throw new Error('Fail');
      });
    });

    it('should reject if an error occurs', async () =>
      expect(fetchRates.fetchRates()).to.eventually.be.rejected);

    after(() => {
      revert();
    });
  });
});
