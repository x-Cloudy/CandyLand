const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
  name: { type: String, require: true },
  src: { type: String, require: true }
});

module.exports = mongoose.model('Image', imageSchema);
