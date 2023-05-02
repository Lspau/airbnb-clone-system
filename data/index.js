'use strict';

const elastic = require("../elastic");
const quotes  = require("./quotes.json");

const esAction = {
  index: {
    _index: elastic.index,
    _type: elastic.type
  }
};