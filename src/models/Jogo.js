class Jogo {
  constructor({ id, id_usuario, valor_aposta, tabuleiro, posicoes_reveladas, diamantes_encontrados, premio_atual, status, criado_em }) {
    this.id = id;
    this.idUsuario = id_usuario;
    this.valorAposta = valor_aposta;
    this.tabuleiro = tabuleiro;
    this.posicoesReveladas = posicoes_reveladas;
    this.diamantesEncontrados = diamantes_encontrados;
    this.premioAtual = premio_atual;
    this.status = status;
    this.criadoEm = criado_em;
  }
}

module.exports = Jogo;
