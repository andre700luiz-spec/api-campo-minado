const pool = require('../config/database');
const Jogo = require('../models/Jogo');

class JogoRepository {
  async criar({ idUsuario, valorAposta, tabuleiro }) {
    const result = await pool.query(
      `INSERT INTO jogos (id_usuario, valor_aposta, tabuleiro, posicoes_reveladas, diamantes_encontrados, premio_atual, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [idUsuario, valorAposta, JSON.stringify(tabuleiro), JSON.stringify([]), 0, 0, 'EM_ANDAMENTO']
    );
    return new Jogo(result.rows[0]);
  }

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM jogos WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    return new Jogo(result.rows[0]);
  }

  async buscarPartidaAtiva(idUsuario) {
    const result = await pool.query(
      `SELECT * FROM jogos WHERE id_usuario = $1 AND status = 'EM_ANDAMENTO' LIMIT 1`,
      [idUsuario]
    );
    if (!result.rows[0]) return null;
    return new Jogo(result.rows[0]);
  }

  async atualizar({ id, posicoesReveladas, diamantesEncontrados, premioAtual, status }) {
    const result = await pool.query(
      `UPDATE jogos
       SET posicoes_reveladas = $1,
           diamantes_encontrados = $2,
           premio_atual = $3,
           status = $4
       WHERE id = $5
       RETURNING *`,
      [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, status, id]
    );
    return new Jogo(result.rows[0]);
  }
}

module.exports = new JogoRepository();
