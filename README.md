# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

* Node.js (v24.15.0)
* Express.js
* PostgreSQL
* dotenv
* cors
* nodemon

## Integrantes
* Paulo Henrique 
* André
* Natan Ulisses
## Instalação

Clone o repositório:
```bash
git clone https://github.com/seu-usuario/api-campo-minado.git
cd api-campo-minado
```

Instale as dependências:
```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
NODE_ENV=development
```

## Banco de Dados

Crie o banco e execute o script SQL:

```bash
psql -U postgres -c "CREATE DATABASE campo_minado;"
psql -U postgres -d campo_minado -f src/config/database.sql
```

## Executando a aplicação

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastrar novo usuário |
| POST | /auth/login | Autenticar usuário |
| PATCH | /auth/reset-password | Redefinir senha |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /users/:id | Retornar dados do usuário |
| GET | /users/dashboard?idUsuario=1 | Estatísticas pessoais |
| PUT | /users/:id | Atualizar saldo |
| DELETE | /users/:id | Excluir usuário |

### Jogo

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /games/start | Iniciar nova partida |
| POST | /games/:gameId/reveal | Revelar posição do tabuleiro |
| POST | /games/:gameId/cashout | Sacar prêmio acumulado |

## Exemplos de uso

### Registrar usuário
```json
POST /auth/register
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```

### Login
```json
POST /auth/login
{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```

### Adicionar saldo
```json
PUT /users/1
{
  "saldo": 500.00
}
```

### Iniciar partida
```json
POST /games/start
{
  "idUser": 1,
  "valorAposta": 100
}
```

### Revelar posição (linha e coluna de 0 a 4)
```json
POST /games/1/reveal
{
  "linha": 2,
  "coluna": 3
}
```

### Sacar prêmio
```json
POST /games/1/cashout
```
