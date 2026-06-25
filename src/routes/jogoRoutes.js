const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/JogoController');

router.post('/start', (req, res) => jogoController.iniciar(req, res));
router.post('/:gameId/reveal', (req, res) => jogoController.revelar(req, res));
router.post('/:gameId/cashout', (req, res) => jogoController.cashout(req, res));

module.exports = router;
