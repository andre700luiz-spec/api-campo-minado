const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/register', (req, res) => authController.registrar(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.patch('/reset-password', (req, res) => authController.resetarSenha(req, res));

module.exports = router;
