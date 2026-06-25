class Usuario {
  constructor({ id, nome, email, data_nascimento, senha, saldo }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.dataNascimento = data_nascimento;
    this.senha = senha;
    this.saldo = saldo;
  }
}

module.exports = Usuario;
