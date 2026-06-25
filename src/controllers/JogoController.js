const jogoService = require('../services/JogoService');

class JogoController {
  async iniciar(req, res) {
    try {
      const resultado = await jogoService.iniciar(req.body);
      return res.status(201).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async revelar(req, res) {
    try {
      const gameId = parseInt(req.params.gameId);
      const { linha, coluna } = req.body;
      const resultado = await jogoService.revelar({ gameId, linha, coluna });
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async cashout(req, res) {
    try {
      const gameId = parseInt(req.params.gameId);
      const resultado = await jogoService.cashout(gameId);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }
}

module.exports = new JogoController();
