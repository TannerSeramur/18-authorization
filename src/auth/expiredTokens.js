'use strict';

const mongoose = require('mongoose');

const expiredTokens = new mongoose.Schema({
  token: {type: String, required: true},
})

module.exports = mongoose.model('expiredTokens', expiredTokens);