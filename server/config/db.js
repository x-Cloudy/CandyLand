const mongoose = require('mongoose');

module.exports = function connectDb() {
  const dbKey = process.env.DB_KEY;
  mongoose.connect(dbKey, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
  db.once('open', () => {
    console.log('Conexão bem-sucedida com o MongoDB!');
  });
};
