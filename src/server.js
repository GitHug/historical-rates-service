require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./cache').init();
const { fetchRates } = require('./fetchRates');

const app = express();

app.use(cors({ origin: '*' }));

app.get('/', (_, res) => res.json(200));

app.get('/rates/historical', (_, res) => fetchRates()
  .then(data => res.json(data))
  .catch(e => res.status(500).json(e.message)));

app.listen(process.env.PORT || 4001);

module.exports = app;
