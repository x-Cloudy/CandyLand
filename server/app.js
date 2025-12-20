const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDb = require('./config/db');
const apiRouter = require('./routes/api');
const { verifyLimiter } = require('./middlewares/limiters');

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://www.melhorenvio.com.br']
      }
    }
  })
);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use('/api', apiRouter);

app.use('/login', verifyLimiter);
app.use('/passwordVerify', verifyLimiter);
app.use('/register', verifyLimiter);
app.use('/cpfVerify', verifyLimiter);
app.use('/emailVerify', verifyLimiter);
app.use('/userEndereco', verifyLimiter);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
