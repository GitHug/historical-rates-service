const { createReadStream } = require('fs');
const csvParse = require('csv-parse');

const options = {
  ltrim: true,
  rtrim: true,
  columns: true,
  skip_empty_lines: true,
  skip_lines_with_empty_value: true,
  delimiter: ',',
};

const removeEmptyLines = record => Object.keys(record)
  .filter(key => !!key)
  .reduce(
    (newRecord, key) =>
      Object.assign(newRecord, { [key]: record[key] }), // Copy value.
    {},
  );

const parse = filePath => new Promise((resolve, reject) => {
  const data = [];

  const input = createReadStream(filePath);
  input.on('error', () => reject(new Error('file not found')));

  const p = csvParse(options);
  p.on('finish', () => {
    input.close();
    p.end();
    resolve(data);
  });
  p.on('readable', () => {
    let record = p.read();
    while (record) {
      // Removes empty lines
      const modifiedRecord = removeEmptyLines(record);

      data.push(modifiedRecord);

      record = p.read();
    }
  });
  p.on('error', err => reject(err.message));

  input.pipe(p);
});

module.exports = { parse };
