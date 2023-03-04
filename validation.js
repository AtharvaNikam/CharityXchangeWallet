const { check } = require('express-validator');

exports.paymentValidation = [
    check('client_id', 'Enter a Valid Client ID').not().isEmpty(),
    check('secret_key', 'Enter a Valid Valid Secret Key').not().isEmpty(),
]