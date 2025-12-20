const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(400).send('Usuário ou email ainda não registrado!');
    const match = await bcrypt.compare(req.body.senha, user.senha);
    if (match) {
      const accessToken = jwt.sign({ cpf: user.cpf }, process.env.SECRET_KEY);
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 72000000,
        sameSite: 'strict'
      });
      res.status(200).json({ id: user._id });
    } else {
      res.status(401).send('Email ou senha inválidos!');
    }
  } catch (err) {
    res.status(500).send('Erro ao autenticar usuário!');
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.status(200).send('Logout bem-sucedido');
};

exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
    const user = new User({
      nome: req.body.nome,
      senha: hashedPassword,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      idade: req.body.idade,
      genero: req.body.genero,
      cpf: req.body.cpf,
      telefone: req.body.telefone,
      favoritos: [],
      meus_pedidos: [],
      role: 0
    });
    await user.save();
    res.status(201).send('Usuário registrado com sucesso!');
  } catch {
    res.status(500).send('Erro ao registrar usuário!');
  }
};

exports.verify = async (req, res) => {
  res.status(200).send('Autorizado');
};

exports.passwordVerify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (user == null) return res.status(400).send('Não registrado!');
    const match = await bcrypt.compare(req.body.senha, user.senha);
    if (match) return res.status(201).send('Senha verificada com sucesso');
    return res.status(401).send('Senha inválida');
  } catch (e) {
    return res.status(500).send('Erro ao verificar senha!');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
    await User.updateOne({ _id: req.body.id }, { $set: { senha: hashedPassword } });
    return res.status(201).send('Senha atualizada com sucesso!');
  } catch (e) {
    return res.status(401).send('Atualização de senha não autorizada');
  }
};
