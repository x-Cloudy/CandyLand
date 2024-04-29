const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const rateLimit = require("express-rate-limit")
require('dotenv').config({ path: "/home/xcloudy/Projetos/pity/CandyLand/.env"})


const app = express();
const PORT = process.env.PORT || 4000;
const dbKey = process.env.DB_KEY
const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;

// Conexão com o MongoDB
mongoose.connect(dbKey, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conexão bem-sucedida com o MongoDB!');
});

const userEnderecoSchema = new mongoose.Schema({
    cep: String,
    logradouro: String,
    numero: Number,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    referencia: String
})

// Definição do esquema do usuário
const userSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String,
    email: String,
    idade: Date,
    genero: String,
    cpf: String,
    telefone: String,
    senha: String,
    endereco: userEnderecoSchema
});
const User = mongoose.model('User', userSchema);

// Definição do esquema do produto
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    promo: Boolean,
    discount: Number,
    disponivel: Number,
    validade: Date,
    marca: String,
    peso: String,
    origem: String,
    contem: String,
    texto: String
});
const Product = mongoose.model('Product', productSchema);

// Middleware para analisar corpos de solicitação
app.use(bodyParser.json());
app.use(helmet());

// Middleware para proteção de cabeçalho HTTP
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const verifyLimiter = rateLimit({
    windowMs: 60 * 1000, // Define a janela de tempo em milissegundos (por exemplo, 1 minuto)
    max: 5, // Define o número máximo de solicitações permitidas dentro da janela de tempo
    message: "Limite de solicitações excedido. Por favor, tente novamente mais tarde."
});

app.use(cors());
app.use('/login', verifyLimiter)

app.post('/verify', authenticateToken, async (req, res) => {
    res.status(201).send("Autorizado");
})


// Rota de registro de usuário
app.post('/register', async (req, res) => {
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
        });

        await user.save();
        res.status(201).send("Usuário registrado com sucesso!");
    } catch {
        res.status(500).send("Erro ao registrar usuário!");
    }
});

// Rota de login de usuário
app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(400).send("Usuário ou email ainda não registrado!");
    try {
        const match = await bcrypt.compare(req.body.senha, user.senha);
        if (match) {
            const accessToken = jwt.sign({ cpf: user.cpf }, secretKey);
            res.json({ accessToken: accessToken, id: user._id });
        } else {
            res.status(401).send("Email ou senha inválidos!");
        }
    } catch {
        res.status(500).send("Erro ao autenticar usuário!");
    }
});

// Rota de informações do usuario
app.post('/user', authenticateToken, async (req, res) => {
    const data = await User.findById({ _id: req.body.id })
    if (data == null) return res.status(400).send("Id não encontrado!");
    return res.json({ user: data })
})

// Rota para adicionar endereço
app.post('/userEndereco', authenticateToken, async (req, res) => {
   await User.updateOne({ _id: req.body.id }, {$set: {endereco: req.body.endereco}})
   return res.status(200).send("Infomações autalizadas com sucesso")
})

// Rota para adicionar um produto
app.post('/products', authenticateToken, async (req, res) => {
    // Validar entrada
    if (!req.body.name || !req.body.price) {
        return res.status(400).send("Nome e preço do produto são obrigatórios!");
    }

    const product = new Product({ name: req.body.name, price: req.body.price });
    await product.save();
    res.status(201).send("Produto adicionado com sucesso!");
});

// Rota para obter todos os produtos
app.get('/products', authenticateToken, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Rota para obter um produto específico
app.get('/products/:id', authenticateToken, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product == null) return res.status(404).send("Produto não encontrado!");
    res.json(product);
});

// Rota para atualizar um produto
app.put('/products/:id', authenticateToken, async (req, res) => {
    // Validar entrada
    if (!req.body.name || !req.body.price) {
        return res.status(400).send("Nome e preço do produto são obrigatórios!");
    }

    const product = await Product.findById(req.params.id);
    if (product == null) return res.status(404).send("Produto não encontrado!");
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    res.json(product);
});

// Rota para excluir um produto
app.delete('/products/:id', authenticateToken, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Configuração do servidor HTTPS com certificado auto-assinado (apenas para desenvolvimento)
const httpsOptions = {
    key: fs.readFileSync('./certificates/chave-privada.key'),
    cert: fs.readFileSync('./certificates/certificado.crt')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});