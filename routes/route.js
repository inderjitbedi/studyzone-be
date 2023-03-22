const express = require('express');
const router = express.Router();
const verifyToken = require('../providers/jwtMiddleware');
const productController = require('../controllers/controller');

router.get('/products', verifyToken, productController.list);
router.post('/products', verifyToken, productController.create);
router.get('/products/:id', verifyToken, productController.get);
router.put('/products/:id', verifyToken, productController.update);
router.delete('/products/:id', verifyToken, productController.delete);

module.exports = router;
