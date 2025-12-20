const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao autenticar');
  }
};
