const express = require('express');
const accountController = require('../controllers/accountController');
const router = express.Router();

router.route('/account').get(accountController.getUsers).post(accountController.store);
router.route('/account/login').post(accountController.login);

module.exports = router;
