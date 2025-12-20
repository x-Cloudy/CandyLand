const Product = require('../models/Product');
const Image = require('../models/Image');
const User = require('../models/User');

exports.createProduct = async (req, res) => {
  const user = await User.findById({ _id: req.body.id });
  if (user == null) return res.status(404).send('Não encontrado');
  if (user.role !== 1) return res.status(400).send('Não autorizado');
  try {
    const product = new Product({
      name: req.body.main.name,
      price: req.body.main.price,
      promo: req.body.main.promo,
      discount: req.body.main.discount,
      disponivel: req.body.main.disponivel,
      validade: req.body.main.validade,
      marca: req.body.main.marca,
      peso: req.body.main.peso,
      origem: req.body.main.origem,
      contem: req.body.main.contem,
      texto: req.body.main.texto,
      categoria: req.body.main.categoria,
      new: req.body.main.new,
      image: req.body.image,
      vendas: 0
    });
    await product.save();
    res.status(201).send('Produto adicionado com sucesso!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao adicionar um produto');
  }
};

exports.listProducts = async (req, res) => {
  const products = await Product.find().populate('image');
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('image');
  if (product == null) return res.status(404).send('Produto não encontrado!');
  res.json(product);
};

exports.getCategoria = async (req, res) => {
  const categoria = await Product.find({ categoria: req.params.id }).populate('image');
  if (categoria == null) return res.status(404).send('Produto não encontrado!');
  res.json(categoria);
};

exports.getCarousel = async (req, res) => {
  const carousel = await Product.find({ categoria: req.params.id, disponivel: { $gt: 0 } }).populate('image').limit(10);
  if (carousel == null) return res.status(404).send('Produto não encontrado!');
  res.json(carousel);
};

exports.getNewProd = async (req, res) => {
  const newProd = await Product.find({ new: true, disponivel: { $gt: 0 } }).populate('image');
  if (newProd == null) return res.status(404).send('Não á nenhum novo produto!');
  res.json(newProd);
};

exports.getPromo = async (req, res) => {
  const promo = await Product.find({ promo: true }).populate('image');
  if (promo == null) return res.status(404).send('Não á nenhuma promoção!');
  res.json(promo);
};

exports.editProduct = async (req, res) => {
  const updatedDate = req.body.newData;
  delete updatedDate._id;
  try {
    await Product.updateOne({ _id: req.body.id }, { $set: updatedDate });
    res.status(200).send('Produto atualizado');
  } catch (err) {
    res.status(500).send('Erro ao atualizar produto');
  }
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  if (req.body.imageId) {
    await Image.findByIdAndDelete(req.body.imageId);
  }
  if (req.body.imageSrc) {
    const fs = require('fs');
    fs.rm('dist' + req.body.imageSrc, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
  res.status(204).send();
};

exports.search = async (req, res) => {
  const products = await Product.find({ name: { $regex: req.params.q, $options: 'i' } }).populate('image');
  const categoria = await Product.find({ categoria: { $regex: req.params.q, $options: 'i' } }).populate('image');
  const allResults = products.concat(categoria);
  const contagem = {};
  allResults.forEach(objeto => {
    const chave = JSON.stringify(objeto);
    contagem[chave] = (contagem[chave] || 0) + 1;
  });
  const unicos = allResults.filter(objeto => {
    const chave = JSON.stringify(objeto);
    if (contagem[chave] > 1) {
      contagem[chave]--;
      return false;
    }
    return true;
  });
  res.json(unicos);
};

exports.dashSearch = async (req, res) => {
  const allResults = [];
  try {
    const admin = await User.findById({ _id: req.query.id });
    if (admin.role !== 1) return res.status(401).send('não autorizado');
    if (req.query.search === '') return res.status(404).send('Nenhum item encontrado');
    const products = await Product.find({ name: { $regex: req.query.search, $options: 'i' } }).populate('image');
    const client = await User.find({ nome: { $regex: req.query.search, $options: 'i' } });
    allResults.push(client);
    allResults.push(products);
    res.status(200).json(allResults);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.topSales = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User não encontrado');
    if (user.role !== 1) return res.status(400).send('Acesso não autorizado!');
    const sales = await Product.find().sort({ vendas: -1 }).limit(10).populate('image').exec();
    res.status(200).send(sales);
  } catch (error) {
    res.status(500).send(error);
  }
};
