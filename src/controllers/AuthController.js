const authService = require('../services/AuthService');

class AuthController {
  async registrar(req, res) {
    try {
      const resultado = await authService.registrar(req.body);
      return res.status(201).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async login(req, res) {
    try {
      const resultado = await authService.login(req.body);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(401).json({ erro: err.message });
    }
  }

  async resetarSenha(req, res) {
    try {
      const resultado = await authService.resetarSenha(req.body);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }
}

module.exports = new AuthController();
