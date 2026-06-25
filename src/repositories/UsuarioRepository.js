const pool = require('../config/database');
const Usuario = require('../models/Usuario');

class UsuarioRepository {
  async criar({ nome, email, dataNascimento, senhaHash }) {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, data_nascimento, senha)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, email, dataNascimento, senhaHash]
    );
    return new Usuario(result.rows[0]);
  }

  async buscarPorEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    if (!result.rows[0]) return null;
    return new Usuario(result.rows[0]);
  }

  async buscarPorId(id) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    if (!result.rows[0]) return null;
    return new Usuario(result.rows[0]);
  }

  async atualizarSenha(id, senhaHash) {
    await pool.query(
      'UPDATE usuarios SET senha = $1 WHERE id = $2',
      [senhaHash, id]
    );
  }

  async atualizarSaldo(id, saldo) {
    const result = await pool.query(
      'UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING *',
      [saldo, id]
    );
    return new Usuario(result.rows[0]);
  }

  async excluir(id) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }

  async obterDashboard(idUsuario) {
    const result = await pool.query(
      `SELECT
        COUNT(*) AS "totalJogos",
        COUNT(*) FILTER (WHERE status = 'VITORIA') AS "vitorias",
        COUNT(*) FILTER (WHERE status = 'DERROTA') AS "derrotas",
        COALESCE(SUM(premio_atual) FILTER (WHERE status = 'VITORIA'), 0) AS "valorGanho",
        COALESCE(SUM(valor_aposta) FILTER (WHERE status = 'DERROTA'), 0) AS "valorPerdido"
       FROM jogos
       WHERE id_usuario = $1`,
      [idUsuario]
    );
    const row = result.rows[0];
    return {
      totalJogos: parseInt(row.totalJogos),
      vitorias: parseInt(row.vitorias),
      derrotas: parseInt(row.derrotas),
      valorGanho: parseFloat(row.valorGanho),
      valorPerdido: parseFloat(row.valorPerdido),
    };
  }
}

module.exports = new UsuarioRepository();
