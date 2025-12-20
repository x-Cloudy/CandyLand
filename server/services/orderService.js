const Pedidos = require('../models/Pedido');

exports.createOrderDb = async (response, frete) => {
  const allProducts = [];
  const allQuantity = [];
  const productLength = response.items.length;
  const date = Date.now();

  for (let i = 0; i < productLength; i++) {
    allProducts.push(response.items[i].id);
    allQuantity.push(response.items[i].quantity);
  }

  try {
    const user_id = response.external_reference.split('-')[0];
    const pedido = new Pedidos({
      product: allProducts,
      product_quantity: allQuantity,
      user: user_id,
      order_id: response.external_reference,
      status: 'pending',
      preference_id: response.id,
      date: date,
      payment_link: response.init_point,
      rastreio: '',
      frete_name: frete.name,
      frete_price: frete.price
    });
    await pedido.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
