const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

router.get('/dashboard', (req, res) => usuarioController.obterDashboard(req, res));
router.get('/:id', (req, res) => usuarioController.buscarPorId(req, res));
router.put('/:id', (req, res) => usuarioController.atualizarSaldo(req, res));
router.delete('/:id', (req, res) => usuarioController.excluir(req, res));

module.exports = router;
