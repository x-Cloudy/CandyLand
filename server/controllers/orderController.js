const Pedidos = require('../models/Pedido');
const Product = require('../models/Product');
const orderService = require('../services/orderService');
const User = require('../models/User');

exports.editPayment = async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User não encontrado');
    if (user.role !== 1) return res.status(400).send('Acesso não autorizado!');
    const content = req.body.content;
    delete content._id;
    const oderId = req.body.order_id;
    await Pedidos.findOneAndUpdate({ _id: oderId }, { status: content.status, rastreio: content.rastreio });
    return res.status(200).send('Pedido atualizado com sucesso!');
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedidos.findById({ _id: req.params.id }).populate(['product', 'user']);
    if (!pedido) return res.status(404).send('pedido não encontrado');
    res.json(pedido);
  } catch (error) {
    res.status(500).send('Erro ao buscar pedido');
  }
};

exports.listPedidos = async (req, res) => {
  const pedidos = await Pedidos.find().populate([
    { path: 'product', populate: { path: 'image', model: 'Image' } },
    { path: 'user' }
  ]);
  if (!pedidos) return res.status(404).send('Nenhum pedido encontrado');
  res.json(pedidos);
};

exports.userPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.find({ user: req.query.id }).populate({
      path: 'product',
      populate: {
        path: 'image'
      }
    });
    res.status(200).send(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao buscar pedidos do usuário');
  }
};

exports.createOrderDb = orderService.createOrderDb;
