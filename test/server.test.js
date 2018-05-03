const rewire = require('rewire');
const http = require('http');
const { expect } = require('chai');

const server = rewire('../src/server');

describe('server', () => {
  const port = '1343';
  let instance;

  before(() => {
    instance = server.listen(port);
  });

  describe('listens to calls', () => {
    let revert;
    const expectedData = [{
      json: 'data',
    }, {
      and: 'some more data',
    }];

    before(() => {
      /* eslint-disable no-underscore-dangle */
      revert = server.__set__('fetchRates', async () => expectedData);
    });

    it('should return 200 on /', (done) => {
      http.get(`http://localhost:${port}/`, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should return data on /rates/historical', (done) => {
      http.get(`http://localhost:${port}/rates/historical`, (res) => {
        let data = '';

        expect(res.statusCode).to.equal(200);

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          expect(JSON.parse(data)).to.deep.equal(expectedData);
          done();
        });
      });
    });

    after(() => {
      revert();
    });
  });

  describe('error handling', () => {
    let revert;
    before(() => {
      revert = server.__set__('fetchRates', async () => {
        throw new Error('Something wrong...');
      });
    });

    it('should return a non-successful status code if an error occurs', (done) => {
      http.get(`http://localhost:${port}/rates/historical`, (res) => {
        expect(res.statusCode).to.equal(500);
        done();
      });
    });

    after(() => {
      revert();
    });
  });

  after(() => {
    instance.close();
  });
});
