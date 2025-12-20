const User = require('../models/User');
const Product = require('../models/Product');
const Pedidos = require('../models/Pedido');

exports.addFavorito = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const product = await Product.findById(req.body.productId);
    const favs = user.favoritos;
    for (let item of favs) {
      let current = JSON.stringify(item).replaceAll('"', '');
      if (current == req.body.productId) {
        return res.status(500).send('Produto já adicionado!');
      }
    }
    user.favoritos.push(product);
    await user.save();
    res.status(200).send('Produto adicionado aos favoritos!.');
  } catch (e) {
    console.error(e);
    res.status(500).send('Ocorreu um erro ao adicionar o produto aos favoritos.');
  }
};

exports.deleteFavorito = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const filter = user.favoritos.filter(item => {
      return JSON.stringify(item).replaceAll('"', '') !== req.body.productId;
    });
    user.favoritos = filter;
    await user.save();
    res.status(200).send('Produto removido dos favoritos!.');
  } catch (error) {
    res.status(500).send('Ocorreu um erro ao remover o produto dos favoritos.');
  }
};

exports.userInfo = async (req, res) => {
  const data = await User.findById({ _id: req.body.id }).populate({
    path: 'favoritos',
    populate: {
      path: 'image'
    }
  });
  if (data == null) return res.status(400).send('Id não encontrado!');
  return res.json({ user: data });
};

exports.usersList = async (req, res) => {
  const admin = await User.findById({ _id: req.body.id });
  if (admin.role !== 1) {
    return res.status(400).send('Não autorizado');
  }
  const users = await User.find();
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) return res.status(404).send('usuario não encontrado');
    const pedidos = await Pedidos.find({ user: user._id }).populate({
      path: 'product',
      populate: {
        path: 'image'
      }
    });
    return res.json({ user: user, pedidos: pedidos });
  } catch (error) {
    res.status(500).send('Erro ao buscar usuário');
  }
};

exports.updateEndereco = async (req, res) => {
  await User.updateOne({ _id: req.body.id }, { $set: { endereco: req.body.endereco } });
  return res.status(200).send('Infomações autalizadas com sucesso');
};

exports.cpfVerify = async (req, res) => {
  try {
    const user = await User.findOne({ cpf: req.body.cpf });
    if (user == null) return res.status(200).json({ valid: true, erro: '' });
    return res.json({ valid: false, erro: 'Cpf já cadastrado' });
  } catch (e) {
    return res.status(400).send('erro ao verificar cpf');
  }
};

exports.emailVerify = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(200).json({ valid: true, erro: '' });
    return res.json({ valid: false, erro: 'Email já cadastrado' });
  } catch (e) {
    return res.status(400).send('erro ao verificar Email');
  }
};
