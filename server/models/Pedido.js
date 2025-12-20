const mongoose = require('mongoose');
const { Schema } = mongoose;

const pedidosSchema = new mongoose.Schema({
  product: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  product_quantity: Array,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  order_id: String,
  status: String,
  preference_id: String,
  date: Date,
  payment_link: String,
  rastreio: String,
  frete_name: String,
  frete_price: String
});

module.exports = mongoose.model('Pedido', pedidosSchema);
