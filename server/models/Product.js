const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: String,
  price: {
    type: Number,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
  },
  promo: Boolean,
  discount: Number,
  disponivel: Number,
  validade: Date,
  marca: String,
  peso: String,
  origem: String,
  contem: String,
  texto: String,
  categoria: String,
  image: { type: Schema.Types.ObjectId, ref: 'Image' },
  new: Boolean,
  vendas: Number
});

module.exports = mongoose.model('Product', productSchema);
