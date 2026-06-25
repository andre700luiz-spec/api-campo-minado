-- Criar banco (rode separado se necessário)
-- CREATE DATABASE campo_minado;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  saldo NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- Tabela de jogos
CREATE TABLE IF NOT EXISTS jogos (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_aposta NUMERIC(12, 2) NOT NULL,
  tabuleiro JSONB NOT NULL,
  posicoes_reveladas JSONB NOT NULL DEFAULT '[]',
  diamantes_encontrados INTEGER NOT NULL DEFAULT 0,
  premio_atual NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
