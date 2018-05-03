const nock = require('nock');
const chai = require('chai');
const cap = require('chai-as-promised');
const fs = require('fs');
const { fetchAndUnzip } = require('../src/unzipperFetcher');

chai.use(cap);
const { expect } = chai;

const expectedPath = './data/eurofxref.csv';
describe('unzipperFetcher', () => {
  it('should be able to download and unzip a file', async () => {
    nock('http://www.example.com')
      .get('/')
      .replyWithFile(200, './test/resources/eurofxref.zip', {
        'Content-Type': 'application/zip',
      });

    const path = await fetchAndUnzip('http://www.example.com/');

    expect(path).to.equal(expectedPath);
  });

  describe('error handling', () => {
    it('should fail as expected when the url is inaccessible', () => {
      nock('http://www.fail.com')
        .get('/')
        .reply(404);

      return expect(fetchAndUnzip('http://www.fail.com/')).to.eventually.be.rejected;
    });
  });

  after(() => {
    if (fs.existsSync(expectedPath)) {
      fs.unlinkSync(expectedPath);
    }
  });
});
