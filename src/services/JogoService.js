const jogoRepository = require('../repositories/JogoRepository');
const usuarioRepository = require('../repositories/UsuarioRepository');

const TAMANHO = 5;
const TOTAL_CELULAS = TAMANHO * TAMANHO; // 25
const TOTAL_BOMBAS = 5;

function gerarTabuleiro() {
  // Cria array de 25 posições: 5 bombas e 20 diamantes
  const celulas = Array(TOTAL_CELULAS).fill('DIAMANTE');
  for (let i = 0; i < TOTAL_BOMBAS; i++) celulas[i] = 'BOMBA';

  // Embaralha (Fisher-Yates)
  for (let i = celulas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [celulas[i], celulas[j]] = [celulas[j], celulas[i]];
  }

  // Converte para matriz 5x5
  const tabuleiro = [];
  for (let l = 0; l < TAMANHO; l++) {
    tabuleiro.push(celulas.slice(l * TAMANHO, l * TAMANHO + TAMANHO));
  }
  return tabuleiro;
}

function calcularPremio(valorAposta, diamantes) {
  return parseFloat((valorAposta * (1 + diamantes * 0.33)).toFixed(2));
}

class JogoService {
  async iniciar({ idUser, valorAposta }) {
    if (!idUser || valorAposta === undefined) {
      throw new Error('idUser e valorAposta são obrigatórios.');
    }

    const valor = parseFloat(Number(valorAposta).toFixed(2));
    if (isNaN(valor) || valor <= 0) throw new Error('Valor da aposta inválido.');

    const usuario = await usuarioRepository.buscarPorId(idUser);
    if (!usuario) throw new Error('Usuário não encontrado.');
    if (parseFloat(usuario.saldo) < valor) throw new Error('Saldo insuficiente.');

    const partidaAtiva = await jogoRepository.buscarPartidaAtiva(idUser);
    if (partidaAtiva) throw new Error('Você já possui uma partida em andamento.');

    // Debita aposta
    const novoSaldo = parseFloat((parseFloat(usuario.saldo) - valor).toFixed(2));
    await usuarioRepository.atualizarSaldo(idUser, novoSaldo);

    const tabuleiro = gerarTabuleiro();
    const jogo = await jogoRepository.criar({ idUsuario: idUser, valorAposta: valor, tabuleiro });

    return { gameId: jogo.id };
  }

  async revelar({ gameId, linha, coluna }) {
    if (linha === undefined || coluna === undefined) {
      throw new Error('Linha e coluna são obrigatórios.');
    }

    const l = parseInt(linha);
    const c = parseInt(coluna);

    if (l < 0 || l >= TAMANHO || c < 0 || c >= TAMANHO) {
      throw new Error('Posição inválida. Linha e coluna devem ser entre 0 e 4.');
    }

    const jogo = await jogoRepository.buscarPorId(gameId);
    if (!jogo) throw new Error('Jogo não encontrado.');
    if (jogo.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada.');

    const posicoesReveladas = Array.isArray(jogo.posicoesReveladas)
      ? jogo.posicoesReveladas
      : [];

    const jaRevelada = posicoesReveladas.some(p => p.linha === l && p.coluna === c);
    if (jaRevelada) throw new Error('Posição já escolhida. Escolha outra posição.');

    const tabuleiro = jogo.tabuleiro;
    const conteudo = tabuleiro[l][c];

    posicoesReveladas.push({ linha: l, coluna: c });

    if (conteudo === 'BOMBA') {
      await jogoRepository.atualizar({
        id: gameId,
        posicoesReveladas,
        diamantesEncontrados: jogo.diamantesEncontrados,
        premioAtual: 0,
        status: 'DERROTA',
      });
      return { resultado: 'BOMBA', status: 'PERDIDO' };
    }

    // Diamante
    const novosDiamantes = jogo.diamantesEncontrados + 1;
    const novoPremio = calcularPremio(parseFloat(jogo.valorAposta), novosDiamantes);

    await jogoRepository.atualizar({
      id: gameId,
      posicoesReveladas,
      diamantesEncontrados: novosDiamantes,
      premioAtual: novoPremio,
      status: 'EM_ANDAMENTO',
    });

    return {
      resultado: 'DIAMANTE',
      diamantesEncontrados: novosDiamantes,
      premioAtual: novoPremio,
    };
  }

  async cashout(gameId) {
    const jogo = await jogoRepository.buscarPorId(gameId);
    if (!jogo) throw new Error('Jogo não encontrado.');
    if (jogo.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada.');
    if (jogo.diamantesEncontrados === 0) {
      throw new Error('Você precisa revelar ao menos um diamante antes de sacar.');
    }

    const premioFinal = parseFloat(jogo.premioAtual);

    await jogoRepository.atualizar({
      id: gameId,
      posicoesReveladas: jogo.posicoesReveladas,
      diamantesEncontrados: jogo.diamantesEncontrados,
      premioAtual: premioFinal,
      status: 'VITORIA',
    });

    const usuario = await usuarioRepository.buscarPorId(jogo.idUsuario);
    const novoSaldo = parseFloat((parseFloat(usuario.saldo) + premioFinal).toFixed(2));
    await usuarioRepository.atualizarSaldo(jogo.idUsuario, novoSaldo);

    return {
      mensagem: 'Cashout realizado com sucesso.',
      premioFinal,
      saldoAtual: novoSaldo,
    };
  }
}

module.exports = new JogoService();
