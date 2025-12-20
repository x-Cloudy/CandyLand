const express = require('express');
const apiRouter = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const imageController = require('../controllers/imageController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');

apiRouter.post('/login', authController.login);
apiRouter.post('/logout', authController.logout);
apiRouter.post('/register', authController.register);
apiRouter.post('/verify', authController.verify);

apiRouter.post('/passwordVerify', authController.passwordVerify);
apiRouter.post('/changePassword', authController.changePassword);

apiRouter.post('/userEndereco', userController.updateEndereco);
apiRouter.post('/cpfVerify', userController.cpfVerify);
apiRouter.post('/emailVerify', userController.emailVerify);

apiRouter.post('/products', productController.createProduct);
apiRouter.get('/products', productController.listProducts);
apiRouter.get('/products/:id', productController.getProduct);
apiRouter.post('/productEdit', productController.editProduct);
apiRouter.delete('/products/:id', productController.deleteProduct);

apiRouter.post('/image', imageController.uploadImage);

apiRouter.get('/search/:q', productController.search);
apiRouter.get('/categoria/:id', productController.getCategoria);
apiRouter.get('/carousel/:id', productController.getCarousel);
apiRouter.get('/getNewProd', productController.getNewProd);
apiRouter.get('/getPromo', productController.getPromo);
apiRouter.get('/topSales', productController.topSales);
apiRouter.get('/dashSearch', productController.dashSearch);

apiRouter.post('/favoritos', userController.addFavorito);
apiRouter.post('/deleteFavorito', userController.deleteFavorito);
apiRouter.post('/user', userController.userInfo);
apiRouter.post('/users', userController.usersList);
apiRouter.get('/users/:id', userController.getUserById);

apiRouter.post('/createPayment', paymentController.createPayment);
apiRouter.put('/editPayment', orderController.editPayment);
apiRouter.post('/checkin', paymentController.checkinWebhook);

apiRouter.get('/pedidos/:id', orderController.getPedidoById);
apiRouter.get('/pedidos', orderController.listPedidos);
apiRouter.get('/userPedidos', orderController.userPedidos);
apiRouter.post('/freteCalculator', paymentController.freteCalculator);

module.exports = apiRouter;
