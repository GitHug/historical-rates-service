const { expect } = require('chai');
const fs = require('fs');
const { clean } = require('../src/cleanUp');

const mkdir = path => !fs.existsSync(path) && fs.mkdirSync(path);
const rmdir = path => fs.existsSync(path) && fs.rmdirSync(path);

const writeFile = path => !fs.existsSync(path) && fs.writeFileSync(path, 'test');
const unlink = path => fs.existsSync(path) && fs.unlinkSync(path);

describe('cleanUp', () => {
  before(() => {
    mkdir('./data');
    writeFile('./data/test.txt');

    mkdir('./data/emptydir');

    mkdir('./data/dir');
    writeFile('./data/dir/foo.txt');
  });

  it('should delete data', () => {
    expect(fs.existsSync('./data')).to.equal(true, 'The data folder should exist');

    expect(clean()).to.deep.equal([{
      files: [
        'foo.txt',
      ],
      folders: [],
      path: './data/dir',
    },
    {
      files: [],
      folders: [],
      path: './data/emptydir',
    },
    {
      files: [
        'test.txt',
      ],
      folders: [
        './data/dir',
        './data/emptydir',
      ],
      path: './data',
    },
    ]);

    expect(fs.existsSync('./data')).to.equal(false, 'The data folder should not exist');
  });

  after(() => {
    unlink('./data/dir/foo.txt');
    rmdir('./data/dir');

    rmdir('./data/emptydir');

    unlink('./data/test.txt');
    rmdir('./data');
  });
});
