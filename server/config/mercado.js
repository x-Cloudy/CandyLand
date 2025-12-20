const pkg = require('mercadopago');
const { MercadoPagoConfig, Preference, Payment } = pkg;
const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });
const preference = new Preference(client);
const payment = new Payment(client);

module.exports = { client, preference, payment };
