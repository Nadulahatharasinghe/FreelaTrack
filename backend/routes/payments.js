const express = require('express');
const router = express.Router();
const { getPayments, createPayment, deletePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/', auth, getPayments);
router.post('/', auth, createPayment);
router.delete('/:id', auth, deletePayment);

module.exports = router;
