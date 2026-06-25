const usuarioService = require('../services/UsuarioService');

class UsuarioController {
  async buscarPorId(req, res) {
    try {
      const resultado = await usuarioService.buscarPorId(parseInt(req.params.id));
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(404).json({ erro: err.message });
    }
  }

  async obterDashboard(req, res) {
    try {
      // O dashboard usa o id via query param ou param; o enunciado não especifica
      // Usaremos query ?idUsuario=1 para flexibilidade
      const idUsuario = parseInt(req.query.idUsuario);
      if (!idUsuario) return res.status(400).json({ erro: 'idUsuario é obrigatório.' });
      const resultado = await usuarioService.obterDashboard(idUsuario);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(404).json({ erro: err.message });
    }
  }

  async atualizarSaldo(req, res) {
    try {
      const resultado = await usuarioService.atualizarSaldo(
        parseInt(req.params.id),
        req.body.saldo
      );
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  }

  async excluir(req, res) {
    try {
      const resultado = await usuarioService.excluir(parseInt(req.params.id));
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = new UsuarioController();
