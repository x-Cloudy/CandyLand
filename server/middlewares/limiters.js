const rateLimit = require('express-rate-limit');

const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Limite de solicitações excedido. Por favor, tente novamente mais tarde.'
});

module.exports = { verifyLimiter };
