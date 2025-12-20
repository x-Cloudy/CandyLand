const Image = require('../models/Image');

exports.uploadImage = async (req, res) => {
  const pathFix2 = '/' + req.file.path.split('/').slice(1, 4).join('/');
  try {
    const { name } = req.body;
    const image = new Image({
      name: name,
      src: pathFix2
    });
    await image.save();
    res.status(200).json(image._id);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar imagem.' });
  }
};
