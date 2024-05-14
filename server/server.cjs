const { Schema } = require('mongoose');
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
require('dotenv').config({ path: "/home/xcloudy/Projetos/pity/CandyLand/.env" })
const upload = require("./multer.cjs")


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

const imageSchema = new mongoose.Schema({
    name: { type: String, require: true },
    src: { type: String, require: true }
})

const Image = mongoose.model("Image", imageSchema);

const userEnderecoSchema = new mongoose.Schema({
    cep: String,
    logradouro: String,
    numero: Number,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    referencia: String,
})

// Definição do esquema do produto
const productSchema = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
    },
    promo: Boolean,
    discount: Number,
    disponivel: Number,
    validade: Date,
    marca: String,
    peso: String,
    origem: String,
    contem: String,
    texto: String,
    categoria: String,
    image: { type: Schema.Types.ObjectId, ref: 'Image' }
});
const Product = mongoose.model('Product', productSchema);

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
    endereco: userEnderecoSchema,
    favoritos: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    meus_pedidos: Array,
    role: Number
});
const User = mongoose.model('User', userSchema);


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
app.use('/passwordVerify', verifyLimiter)
app.use('/register', verifyLimiter)
app.use('/cpfVerify', verifyLimiter)
app.use('/emailVerify', verifyLimiter)
app.use('/userEndereco', verifyLimiter)


// Rota para adicionar produtos nos favoritos do cliente
app.post("/favoritos", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.body.id)
        const product = await Product.findById(req.body.productId)

        user.favoritos.push(product)
        await user.save();

        res.status(200).send("Produto adicionado aos favoritos com sucesso.");
    } catch (e) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao adicionar o produto aos favoritos.");
    }
})

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
            favoritos: [],
            meus_pedidos: [],
            role: 0
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

// Password verify
app.post('/passwordVerify', authenticateToken, async (req, res) => {
    const user = await User.findOne({ _id: req.body.id });
    if (user == null) return res.status(400).send("Não registrado!");

    try {
        const match = await bcrypt.compare(req.body.senha, user.senha);
        if (match) {
            return res.status(201).send("Senha verificada com sucesso");
        } else {
            return res.status(401).send("Senha inválida");
        }
    } catch (e) {
        return res.status(500).send("Erro ao verificar senha!");
    }
})

// Rota para mudar senha
app.post('/changePassword', authenticateToken, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
        await User.updateOne({ _id: req.body.id }, { $set: { senha: hashedPassword } })
        return res.status(201).send('Senha atualizada com sucesso!');
    } catch (e) {
        return res.status(401).send('Atualização de senha não autorizada')
    }
})

// Rota de informações do usuario
app.post('/user', authenticateToken, async (req, res) => {
    const data = await User.findById({ _id: req.body.id }).populate('favoritos');
    if (data == null) return res.status(400).send("Id não encontrado!");
    return res.json({ user: data })
})

// Rota para adicionar endereço
app.post('/userEndereco', authenticateToken, async (req, res) => {
    await User.updateOne({ _id: req.body.id }, { $set: { endereco: req.body.endereco } })
    return res.status(200).send("Infomações autalizadas com sucesso")
})

//Verifica se o cpf já está cadastrado no banco de dados
app.post('/cpfVerify', async (req, res) => {
    try {
        const user = await User.findOne({ cpf: req.body.cpf })
        if (user == null) return res.status(200).json({ valid: true, erro: '' });

        return res.json({ valid: false, erro: 'Cpf já cadastrado' })
    } catch (e) {
        return res.status(400).send('erro ao verificar cpf')
    }
})

//Verifica se o email já está cadastrado no banco de dados
app.post('/emailVerify', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user == null) return res.status(200).json({ valid: true, erro: '' });

        return res.json({ valid: false, erro: 'Email já cadastrado' })
    } catch (e) {
        return res.status(400).send('erro ao verificar Email')
    }
})

// Rota para adicionar um produto
app.post('/products', authenticateToken, async (req, res) => {
    // Validar entrada

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
            image: req.body.image
        });
        await product.save();
        res.status(201).send("Produto adicionado com sucesso!");
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro ao adicionar um produto")
    }

});

// Adiciona imagem ao banco de dados
app.post('/image', upload.single("file"), async (req, res) => {
    try {
        const { name } = req.body
        const image = new Image({
            name: name,
            src: req.file.path
        });
        await image.save();
        res.status(200).json(image._id)
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar imagem." })
    }

})

// Rota para obter todos os produtos
app.get('/products', async (req, res) => {
    const products = await Product.find().populate('image');
    res.json(products);
});

// Faz buscas no banco de dados com diferentes inputs
app.get("/search/:q", async (req, res) => {
    const products = await Product.find({ name: { $regex: req.params.q, $options: 'i' } }).populate('image')
    const categoria = await Product.find({ categoria: { $regex: req.params.q, $options: 'i' } }).populate('image')
    const allResults = products.concat(categoria);
    res.json(allResults)
})

// Rota para obter um produto específico
app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('image');
    if (product == null) return res.status(404).send("Produto não encontrado!");
    res.json(product);
});

// Rota para obter uma categoria em específico
app.get('/categoria/:id', async (req, res) => {
    const categoria = await Product.find({ categoria: req.params.id }).populate("image")
    if (categoria == null) return res.status(404).send("Produto não encontrado!");
    res.json(categoria);
})


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
    await Image.findByIdAndDelete(req.body.imageId)
    fs.rm(req.body.imageSrc, (error) => {
        if (error) {
            console.log(error)
        }
    })
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