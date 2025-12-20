const mongoose = require('mongoose');
const { Schema } = mongoose;

const userEnderecoSchema = new mongoose.Schema({
  cep: String,
  logradouro: String,
  numero: Number,
  complemento: String,
  bairro: String,
  cidade: String,
  estado: String,
  referencia: String
});

const userSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  email: String,
  idade: Date,
  genero: String,
  cpf: String,
  telefone: String,
  senha: String,
  endereco: userEnderecoSchema,
  favoritos: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  role: Number
});

module.exports = mongoose.model('User', userSchema);
