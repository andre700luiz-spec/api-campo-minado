const crypto = require('crypto');
const usuarioRepository = require('../repositories/UsuarioRepository');

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

function validarRequisitossenha(senha) {
  if (senha.length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
  if (!/[0-9]/.test(senha)) return 'A senha deve conter pelo menos um número.';
  if (!/[^A-Za-z0-9]/.test(senha)) return 'A senha deve conter pelo menos um caractere especial.';
  return null;
}

class AuthService {
  async registrar({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
    if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    const erroSenha = validarRequisitossenha(senha);
    if (erroSenha) throw new Error(erroSenha);

    if (senha !== confirmacaoSenha) {
      throw new Error('A senha e a confirmação de senha não coincidem.');
    }

    const existente = await usuarioRepository.buscarPorEmail(email);
    if (existente) throw new Error('E-mail já cadastrado.');

    const senhaHash = hashSenha(senha);
    const usuario = await usuarioRepository.criar({ nome, email, dataNascimento, senhaHash });

    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  }

  async login({ email, senha }) {
    if (!email || !senha) throw new Error('E-mail e senha são obrigatórios.');

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error('Credenciais inválidas.');

    const senhaHash = hashSenha(senha);
    if (usuario.senha !== senhaHash) throw new Error('Credenciais inválidas.');

    return {
      nome: usuario.nome,
      email: usuario.email,
      dataNascimento: usuario.dataNascimento,
    };
  }

  async resetarSenha({ id, novaSenha }) {
    if (!id || !novaSenha) throw new Error('ID e nova senha são obrigatórios.');

    const erroSenha = validarRequisitossenha(novaSenha);
    if (erroSenha) throw new Error(erroSenha);

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado.');

    const novaSenhaHash = hashSenha(novaSenha);
    if (usuario.senha === novaSenhaHash) {
      throw new Error('A nova senha não pode ser igual à senha atual.');
    }

    await usuarioRepository.atualizarSenha(id, novaSenhaHash);
    return { mensagem: 'Senha atualizada com sucesso.' };
  }
}

module.exports = new AuthService();
