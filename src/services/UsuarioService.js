const usuarioRepository = require('../repositories/UsuarioRepository');

class UsuarioService {
  async buscarPorId(id) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado.');
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      saldo: parseFloat(usuario.saldo),
    };
  }

  async obterDashboard(idUsuario) {
    const usuario = await usuarioRepository.buscarPorId(idUsuario);
    if (!usuario) throw new Error('Usuário não encontrado.');
    return await usuarioRepository.obterDashboard(idUsuario);
  }

  async atualizarSaldo(id, saldo) {
    if (saldo === undefined || saldo === null) throw new Error('Saldo é obrigatório.');
    if (typeof saldo !== 'number' && isNaN(Number(saldo))) throw new Error('Saldo inválido.');

    const valor = parseFloat(Number(saldo).toFixed(2));
    if (valor < 0) throw new Error('Não é permitido cadastrar saldo negativo.');

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado.');

    const atualizado = await usuarioRepository.atualizarSaldo(id, valor);
    return {
      id: atualizado.id,
      nome: atualizado.nome,
      email: atualizado.email,
      saldo: parseFloat(atualizado.saldo),
    };
  }

  async excluir(id) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado.');
    await usuarioRepository.excluir(id);
    return { mensagem: 'Usuário excluído com sucesso.' };
  }
}

module.exports = new UsuarioService();
