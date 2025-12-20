const { preference, payment } = require('../config/mercado');
const orderService = require('../services/orderService');
const Product = require('../models/Product');
const Pedidos = require('../models/Pedido');
const axios = require('axios');
const { verifyHmac } = require('../utils/hmacVerify');

exports.createPayment = async (req, res) => {
  const data = req.body.data;
  const id = req.body.id;
  const frete = req.body.frete;

  const now = new Date(Date.now());
  const expirationDateFrom = now.toISOString();
  const expirationDateTo = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();

  const body = {
    items: [],
    expires: true,
    expiration_date_from: expirationDateFrom,
    expiration_date_to: expirationDateTo,
    statement_descriptor: 'CandyLand-store',
    external_reference: id + '-' + Date.now(),
    shipments: {
      cost: Number(frete.price)
    }
  };

  for (let item of data) {
    let discount = 0;
    if (item.promo) {
      discount = (item.price * item.discount) / 100;
    }
    let items = {
      id: item._id,
      title: item.name,
      category_id: item.categoria,
      quantity: item.quantidade,
      currency_id: 'BRL',
      unit_price: item.price - discount
    };
    body.items.push(items);
  }

  try {
    const preference_response = await preference.create({ body });
    const order_db_response = await orderService.createOrderDb(preference_response, frete);
    if (order_db_response) {
      res.status(200).send(preference_response.init_point);
    } else {
      res.status(500).send('Erro ao salver o pedido!');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Um erro inesperado aconteceu');
  }
};

exports.checkinWebhook = async (req, res) => {
  try {
    const secret = process.env.MC_SECRET;
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];
    const urlParams = req.query;
    const dataID = urlParams['data.id'];
    const verified = verifyHmac(xSignature, xRequestId, dataID, secret);
    if (!verified) {
      console.log('HMAC verification failed');
      return res.status(200).send('OK');
    }

    if (req.body.type === 'payment') {
      payment.get({ id: req.body.data.id }).then(async (response) => {
        try {
          const itemLenght = response.additional_info.items.length;
          const order = await Pedidos.findOneAndUpdate({ order_id: response.external_reference }, { status: response.status });
          if (order == null) return;
          if (response.status === 'approved') {
            for (let i = 0; i < itemLenght; i++) {
              await Product.updateOne({ _id: order.product[i] }, { $inc: { disponivel: -order.product_quantity[i], vendas: +order.product_quantity[i] } });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }).catch(console.log);
    }
    res.status(200).send('OK');
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro no webhook');
  }
};

exports.freteCalculator = async (req, res) => {
  const cep = req.body.cep;
  const products = req.body.products;
  const product_weigth = products.reduce((acc, cur) => {
    const peso = cur.peso.replace('g', '').replace('ml', '');
    const total = Number(peso) * Number(cur.quantidade);
    return acc + total;
  }, 0);

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MELHOR_ENVIO}`,
        'User-Agent': 'Aplicação elailcep@gmail.com'
      },
      data: {
        from: { postal_code: '12400450' },
        to: { postal_code: cep },
        package: { height: 20, width: 20, length: 20, weight: product_weigth / 1000 }
      }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.log('Catch error', error);
    res.status(500).send(error);
  }
};
