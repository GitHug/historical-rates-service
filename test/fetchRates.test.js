const rewire = require('rewire');
const chai = require('chai');
const cap = require('chai-as-promised');
const sinon = require('sinon');
const cache = require('../src/cache').init();

const fetchRates = rewire('../src/fetchRates');

chai.use(cap);
const { expect } = chai;

describe('fetchRates', () => {
  it('should be able to fetchRates without failing', async () => {
    const data = await fetchRates.fetchRates();
    expect(data.length).to.be.above(100);
  });

  it('should cache the result', async () => {
    /* eslint-disable no-underscore-dangle */
    const stub = sinon.stub();
    const rev = fetchRates.__set__('parse', async () => {
      stub();
      return { test: 'data' };
    });

    try {
      await fetchRates.fetchRates();
      await fetchRates.fetchRates();
      expect(stub.calledOnce).to.equal(true);
    } finally {
      rev();
    }
  });

  afterEach(() => {
    cache.del('rates');
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
