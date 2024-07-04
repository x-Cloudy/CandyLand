const { Schema } = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require("express-rate-limit")
require('dotenv').config({ path: "server/.env" })
const upload = require("./multer.cjs");
const path = require('path');
const crypto = require('crypto')
const cookieParser = require("cookie-parser");
const axios = require("axios");

const app = express();
const apiRouter = express.Router();
const PORT = process.env.PORT || 4000;
const dbKey = process.env.DB_KEY
const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;
const pkg = require('mercadopago')
const { MercadoPagoConfig, Preference, Payment } = pkg;
const algorithm = 'aes-256-cbc';

app.use(cors());
app.use(bodyParser.json()); // bodyParser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use('/api', apiRouter);

// Middleware para proteção de cabeçalho HTTP
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../dist')));

// // Rota para servir a aplicação (para React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const verifyLimiter = rateLimit({
    windowMs: 60 * 1000, // Define a janela de tempo em milissegundos (por exemplo, 1 minuto)
    max: 5, // Define o número máximo de solicitações permitidas dentro da janela de tempo
    message: "Limite de solicitações excedido. Por favor, tente novamente mais tarde."
});

app.use('/login', verifyLimiter)
app.use('/passwordVerify', verifyLimiter)
app.use('/register', verifyLimiter)
app.use('/cpfVerify', verifyLimiter)
app.use('/emailVerify', verifyLimiter)
app.use('/userEndereco', verifyLimiter)

// Conexão com o MongoDB
mongoose.connect(dbKey);
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
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    new: Boolean,
    vendas: Number
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
    role: Number
});
const User = mongoose.model('User', userSchema);


const pedidosSchema = new mongoose.Schema({
    product: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    product_quantity: Array,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    order_id: String,
    status: String,
    preference_id: String,
    date: Date,
    payment_link: String,
    rastreio: String
})
const Pedidos = mongoose.model('Pedido', pedidosSchema)

// Middleware de autenticação
function authenticateToken(req, res, next) {
    // const token = req.headers['authorization'];
    try {
        const token = req.cookies && req.cookies.token
        if (!token) return res.sendStatus(401);

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro ao autenticar")
    }

}

// Rota de login de usuário
apiRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user == null) return res.status(400).send("Usuário ou email ainda não registrado!");
        const match = await bcrypt.compare(req.body.senha, user.senha);
        if (match) {
            const accessToken = jwt.sign({ cpf: user.cpf }, secretKey);

            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 72000000,
                sameSite: 'strict',
            });

            // res.json({ accessToken: result, id: user._id });
            res.status(200).json({ id: user._id });
        } else {
            res.status(401).send("Email ou senha inválidos!");
        }
    } catch (err) {
        res.status(500).send("Erro ao autenticar usuário!");
    }
});

apiRouter.post('/logout', authenticateToken, async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.status(200).send('Logout bem-sucedido');
})

// Rota de registro de usuário
apiRouter.post('/register', async (req, res) => {
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


// Rota para adicionar produtos nos favoritos do cliente
apiRouter.post("/favoritos", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.body.id)
        const product = await Product.findById(req.body.productId)
        const favs = user.favoritos

        for (let item of favs) {
            let current = JSON.stringify(item).replaceAll('"', '');
            if (current == req.body.productId) {
                return res.status(500).send("Produto já adicionado!")
            }
        }

        user.favoritos.push(product)
        await user.save();

        res.status(200).send("Produto adicionado aos favoritos!.");
    } catch (e) {
        console.error(e);
        res.status(500).send("Ocorreu um erro ao adicionar o produto aos favoritos.");
    }
})

apiRouter.post("/deleteFavorito", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        const filter = user.favoritos.filter(item => {
            return JSON.stringify(item).replaceAll('"', '') !== req.body.productId
        });
        user.favoritos = filter
        await user.save();
        res.status(200).send("Produto removido dos favoritos!.");
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao remover o produto dos favoritos.");
    }
})

// Verifica se o token é válido
apiRouter.post('/verify', authenticateToken, async (req, res) => {
    res.status(200).send("Autorizado");
})

// Password verify
apiRouter.post('/passwordVerify', authenticateToken, async (req, res) => {
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
apiRouter.post('/changePassword', authenticateToken, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
        await User.updateOne({ _id: req.body.id }, { $set: { senha: hashedPassword } })
        return res.status(201).send('Senha atualizada com sucesso!');
    } catch (e) {
        return res.status(401).send('Atualização de senha não autorizada')
    }
})


// Rota para adicionar endereço
apiRouter.post('/userEndereco', authenticateToken, async (req, res) => {
    await User.updateOne({ _id: req.body.id }, { $set: { endereco: req.body.endereco } })
    return res.status(200).send("Infomações autalizadas com sucesso")
})

//Verifica se o cpf já está cadastrado no banco de dados
apiRouter.post('/cpfVerify', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ cpf: req.body.cpf })
        if (user == null) return res.status(200).json({ valid: true, erro: '' });

        return res.json({ valid: false, erro: 'Cpf já cadastrado' })
    } catch (e) {
        return res.status(400).send('erro ao verificar cpf')
    }
})

//Verifica se o email já está cadastrado no banco de dados
apiRouter.post('/emailVerify', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user == null) return res.status(200).json({ valid: true, erro: '' });

        return res.json({ valid: false, erro: 'Email já cadastrado' })
    } catch (e) {
        return res.status(400).send('erro ao verificar Email')
    }
})

// Rota para adicionar um produto
apiRouter.post('/products', authenticateToken, async (req, res) => {
    // Validar entrada
    const user = await User.findById({ _id: req.body.id });

    if (user == null) return res.status(404).send("Não encontrado");
    if (user.role !== 1) return res.status(400).send("Não autorizado")


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
        res.status(201).send("Produto adicionado com sucesso!");
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro ao adicionar um produto")
    }

});

// Adiciona imagem ao banco de dados
apiRouter.post('/image', upload.single("file"), authenticateToken, async (req, res) => {
    const pathFix = '/' + req.file.path.split('/').slice(2, 4).join('/')
    const pathFix2 = '/' + req.file.path.split('/').slice(1, 4).join('/')
    try {
        const { name } = req.body
        const image = new Image({
            name: name,
            src: pathFix2
        });
        await image.save();
        res.status(200).json(image._id)
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar imagem." })
    }
})

// Rota para obter todos os produtos
apiRouter.get('/products', async (req, res) => {
    const products = await Product.find().populate('image');
    res.json(products);
});

// Faz buscas no banco de dados com diferentes inputs
apiRouter.get("/search/:q", async (req, res) => {
    const products = await Product.find({ name: { $regex: req.params.q, $options: 'i' } }).populate('image')
    const categoria = await Product.find({ categoria: { $regex: req.params.q, $options: 'i' } }).populate('image')
    const allResults = products.concat(categoria);
    const contagem = {};

    allResults.forEach(objeto => {
        const chave = JSON.stringify(objeto);
        contagem[chave] = (contagem[chave] || 0) + 1;
    })

    const unicos = allResults.filter(objeto => {
        const chave = JSON.stringify(objeto);
        if (contagem[chave] > 1) {
            contagem[chave]--;
            return false;
        }
        return true;
    });
    res.json(unicos)
})

// Rota para obter um produto específico
apiRouter.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('image');
    if (product == null) return res.status(404).send("Produto não encontrado!");
    res.json(product);
});

// Rota para obter uma categoria em específico
apiRouter.get('/categoria/:id', async (req, res) => {
    const categoria = await Product.find({ categoria: req.params.id }).populate("image")
    if (categoria == null) return res.status(404).send("Produto não encontrado!");
    res.json(categoria);
})

apiRouter.get('/getNewProd', async (req, res) => {
    const newProd = await Product.find({ new: true }).populate("image")
    if (newProd == null) return res.status(404).send("Não á nenhum novo produto!");
    res.json(newProd)
})

apiRouter.get('/getPromo', async (req, res) => {
    const promo = await Product.find({ promo: true }).populate("image")
    if (promo == null) return res.status(404).send("Não á nenhuma promoção!");
    res.json(promo)
})

// Rota para atualizar um produto
apiRouter.post('/productEdit', authenticateToken, async (req, res) => {
    const updatedDate = req.body.newData;
    delete updatedDate._id;
    try {
        await Product.updateOne({ _id: req.body.id }, { $set: updatedDate })
        res.status(200).send("Produto atualizado")
    } catch (err) {
        res.status(500).send("Erro ao atualizar produto")
    }
    ///
});

// Rota para excluir um produto
apiRouter.delete('/products/:id', authenticateToken, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    await Image.findByIdAndDelete(req.body.imageId)
    fs.rm("dist" + req.body.imageSrc, (error) => {
        if (error) {
            console.log(error)
        }
    })
    res.status(204).send();
});

// Rota de informações do usuario
apiRouter.post('/user', authenticateToken, async (req, res) => {
    const data = await User.findById({ _id: req.body.id }).populate({
        path: 'favoritos',
        populate: {
            path: 'image'
        }
    });
    if (data == null) return res.status(400).send("Id não encontrado!");
    return res.json({ user: data })
})

// Pega as informações de todos os usuarios
apiRouter.post('/users', authenticateToken, async (req, res) => {
    const admin = await User.findById({ _id: req.body.id });

    if (admin.role !== 1) {
        return res.status(400).send("Não autorizado");
    }

    const users = await User.find();
    return res.json(users)
})

// Busca as informações de apenas um usuario
apiRouter.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        if (!user) return res.status(404).send("usuario não encontrado")
        const pedidos = await Pedidos.find({ user: user._id }).populate({
            path: 'product',
            populate: {
                path: 'image'
            }
        })
        return res.json({ user: user, pedidos: pedidos })
    } catch (error) {
        res.status(500).send('Erro ao buscar usuário')
    }
})

// Pega um pedido em especifico
apiRouter.get('/pedidos/:id', authenticateToken, async (req, res) => {
    try {
        const pedido = await Pedidos.findById({ _id: req.params.id }).populate(["product", "user"])
        if (!pedido) return res.status(404).send("pedido não encontrado")
        res.json(pedido)
    } catch (error) {
        res.status(500).send('Erro ao buscar pedido')
    }
})

// Pega todos os pedidos
apiRouter.get('/pedidos', authenticateToken, async (req, res) => {
    const pedidos = await Pedidos.find().populate([
        { path: 'product', populate: { path: 'image', model: 'Image' } },
        { path: 'user' }
      ]);
    if (!pedidos) return res.status(404).send('Nenhum pedido encontrado')

    res.json(pedidos)
})

// Busca os pedidos de um usuário
apiRouter.get('/userPedidos', authenticateToken, async (req, res) => {
    try {
        const pedidos = await Pedidos.find({ user: req.query.id }).populate({
            path: 'product',
            populate: {
                path: 'image'
            }
        })
        res.status(200).send(pedidos)
    } catch (error) {
        console.log(error)
    }
})

apiRouter.get('/dashSearch', authenticateToken, async (req, res) => {
    const allResults = [];

    try {
        const admin = await User.findById({ _id: req.query.id });
        if (admin.role !== 1) return res.status(401).send("não autorizado");
        if (req.query.search === '') return res.status(404).send('Nenhum item encontrado')

        const products = await Product.find({ name: { $regex: req.query.search, $options: 'i' } }).populate('image');
        const client = await User.find({ nome: { $regex: req.query.search, $options: 'i' } });
        allResults.push(client);
        allResults.push(products);
        res.status(200).json(allResults)
    } catch (error) {
        res.status(500).send(error)
    }

})

apiRouter.get('/topSales', authenticateToken, async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        if (!user) return res.status(404).send("User não encontrado");
        if (user.role !== 1) return res.status(400).send("Acesso não autorizado!");

        const sales = await Product.find().sort({ vendas: -1 }).limit(10).populate('image').exec();
        res.status(200).send(sales);
    } catch (error) {
        res.status(500).send(error);
    }
})

// PAYMENT
//////////
//////////

const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });
const preference = new Preference(client);

apiRouter.post('/createPayment', authenticateToken, async (req, res) => {
    const data = req.body.data;
    const id = req.body.id;

    const now = new Date(Date.now());
    const expirationDateFrom = now.toISOString();
    const expirationDateTo = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();

    const body = {
        items: [],
        expires: true,
        expiration_date_from: expirationDateFrom,
        expiration_date_to: expirationDateTo,
        statement_descriptor: 'CandyLand-store',
        external_reference: id + '-' + Date.now(),
    };

    for (let item of data) {
        let discount = 0;
        if (item.promo) {
            discount = (item.price * item.discount) / 100;
        }
        let items = {
            id: item._id,
            title: item.name,
            category_id: item.categoria,
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: item.price - discount,
        }
        body.items.push(items)
    }

    try {
        const preference_response = await preference.create({ body });
        const order_db_response = await create_order_db(preference_response);
        if (order_db_response) {
            res.status(200).send(preference_response.init_point) //mudar em prod
        } else {
            res.status(500).send("Erro ao salver o pedido!")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Um erro inesperado aconteceu");
    }


})

apiRouter.put('/editPayment', authenticateToken, async (req, res) => {

    try {
        // Verificação para se o user é um admin
        const id = req.body.id;
        const user = await User.findById(id);
        if (!user) return res.status(404).send("User não encontrado");
        if (user.role !== 1) return res.status(400).send("Acesso não autorizado!");

        // Edita o pedido com a data enviada
        const content = req.body.content;
        delete content._id; // Retira o id vindo da nova data
        const oderId = req.body.order_id;
        await Pedidos.findOneAndUpdate({ _id: oderId }, { status: content.status, rastreio: content.rastreio });
        return res.status(200).send("Pedido atualizado com sucesso!")
    } catch (error) {
        return res.status(400).send(error);
    }
})

async function create_order_db(response) {

    const allProducts = [];
    const allQuantity = [];
    const productLength = response.items.length
    const date = Date.now();

    for (let i = 0; i < productLength; i++) {
        allProducts.push(response.items[i].id);
        allQuantity.push(response.items[i].quantity)
    }

    try {
        const user_id = response.external_reference.split('-')[0];
        const pedido = new Pedidos({
            product: allProducts,
            product_quantity: allQuantity,
            user: user_id,
            order_id: response.external_reference,
            status: 'pending',
            preference_id: response.id,
            date: date,
            payment_link: response.init_point,
            rastreio: ""
        })
        await pedido.save();
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

apiRouter.post('/checkin', async (req, res) => {
    try {
        const secret = process.env.MC_SECRET
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];
        const urlParams = req.query
        const dataID = urlParams['data.id'];
        const parts = xSignature.split(',');
        let ts;
        let hash;

        parts.forEach(part => {
            // Split each part into key and value
            const [key, value] = part.split('=');
            if (key && value) {
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'ts') {
                    ts = trimmedValue;
                } else if (trimmedKey === 'v1') {
                    hash = trimmedValue;
                }
            }
        });

        const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(manifest);

        const sha = hmac.digest('hex');

        // Compara se oque veio do webhook foi enviado pelo marcado pago
        if (sha === hash) {

            if (req.body.type === 'payment') {
                const payment = new Payment(client);

                payment.get({
                    id: req.body.data.id,
                }).then(async (response) => {
                    try {
                        // Atualiza o status do pedido para o vindo do webhook
                        const itemLenght = response.additional_info.items.length
                        const order = await Pedidos.findOneAndUpdate({ order_id: response.external_reference }, { status: response.status });
                        if (order == null) return;

                        // Retira a quantidade comprada dos produtos
                        if (response.status === "approved") {
                            for (let i = 0; i < itemLenght; i++) {
                                await Product.updateOne({ _id: order.product[i] }, { $inc: { disponivel: - order.product_quantity[i], vendas: + order.product_quantity[i] } })
                            }
                        }

                    } catch (error) {
                        console.log(error)
                    }

                }).catch(console.log);

            }
        } else {
            console.log("HMAC verification failed");
        }

        res.status(200).send('OK'); // Envia o status 200 com mensagem 'OK' e finaliza a resposta
    } catch (error) {
        console.log(error)
    }

});


// MELHOR ENVIO

apiRouter.post('/freteCalculator', async (req, res) => {
    const cep = req.body.cep;
  
    try {
        const response = await axios({
            method: "POST",
            url: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiIwNzNmZWZlM2E4NjA1MjA1NTZiMGUwZDRlNDI2MzQyMTlhMGQ1MWViZmU1YWM4MTY1ZGI4N2NmYTQxMDlhY2I5N2M1YzkxYWM5MzcyMTQ1YSIsImlhdCI6MTcyMDAxNjQ4NS43NzYxMzgsIm5iZiI6MTcyMDAxNjQ4NS43NzYxNCwiZXhwIjoxNzUxNTUyNDg1Ljc2NTQxNiwic3ViIjoiOWM2ZGVmOTktZDA3Ny00YTFhLWIzZTUtNzQwYmI4ZjZkMjQzIiwic2NvcGVzIjpbImNhcnQtcmVhZCIsImNhcnQtd3JpdGUiLCJjb21wYW5pZXMtcmVhZCIsImNvbXBhbmllcy13cml0ZSIsImNvdXBvbnMtcmVhZCIsImNvdXBvbnMtd3JpdGUiLCJub3RpZmljYXRpb25zLXJlYWQiLCJvcmRlcnMtcmVhZCIsInByb2R1Y3RzLXJlYWQiLCJwcm9kdWN0cy1kZXN0cm95IiwicHJvZHVjdHMtd3JpdGUiLCJwdXJjaGFzZXMtcmVhZCIsInNoaXBwaW5nLWNhbGN1bGF0ZSIsInNoaXBwaW5nLWNhbmNlbCIsInNoaXBwaW5nLWNoZWNrb3V0Iiwic2hpcHBpbmctY29tcGFuaWVzIiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1wcmV2aWV3Iiwic2hpcHBpbmctcHJpbnQiLCJzaGlwcGluZy1zaGFyZSIsInNoaXBwaW5nLXRyYWNraW5nIiwiZWNvbW1lcmNlLXNoaXBwaW5nIiwidHJhbnNhY3Rpb25zLXJlYWQiLCJ1c2Vycy1yZWFkIiwidXNlcnMtd3JpdGUiLCJ3ZWJob29rcy1yZWFkIiwid2ViaG9va3Mtd3JpdGUiLCJ3ZWJob29rcy1kZWxldGUiLCJ0ZGVhbGVyLXdlYmhvb2siXX0.MwnizWbfaG7-yA9pjyabCddDSyu1hOPUiTdgwU-mIEjwxFEK38VR-QVzYuP5F9CNJO8II9CZNt3z14yIKz1wLt3UXI33toXoinKiUUir7LsZ0Tlz5u5SeHmsQu32Z83MZg0ZIyxb-psW8hHtYmc0EGjF-gDBx_pj5n86FZQmBkcR9PnYQictZ5vYy7fAAZojF-pbYyKWuS-9yEAw1Q4erxeKKwV-ZA_tSkJbua15KTmf4xKfXXDptuLyPtv-bDwWwGvs1ocdRJ_SHTD208jh3hgJx1ey-tQSREZ1GsRjokbZT6WDbJbjZ34a8J6PUCWbTtNawa1XKRzzs1jHLnab-21a9rwJh39poHjw76jHcNmqzJyJFcbruBAUV7eqOUpeTD7tNwjHoxVZbLydngBLgjmdAadoVPTvQz6mTRzunDczXv43_FoYT1xdMiD-GsC8W_tjGYvpRgrST9fLYY_ygImkcKcR9aDVBuWtHV5b002sxapCrmjYYbMYKQYUVkcfAeIdPEzQOwooWXeSiHef9YWIP9VFul5FoXCV0F2HhEnUg4qQXyhPJjjbh5nTRkGAbY_k_biovBtrcbLGNiMt6Eq4TKkgH_lt6Gx9xrQoKEORAoRfzUcIZLQyENJT_2-2ScAQ98pAyb02gNY_Elfs4H_yi9J3RPDs7oyPFMt77Cc',
                'User-Agent': 'Aplicação cloudibr@gmail.com',
            }, 
            data: {
                from: {postal_code: '12400660'},
                to: {postal_code: cep},
                package: {height: 4, width: 12, length: 17, weight: 0.3}
            }
        });
        return res.status(200).json(response.data);
    } catch(error) {
        console.log("Catch error", error)
        res.status(500).send(error)
    }
})



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});