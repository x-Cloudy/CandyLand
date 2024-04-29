class Validation {
  constructor() {
    this.validEmailCaracter = ["@", ".com"];
  }

  valid(type = null, data = null) {
    // verifição de argumento de função
    if (data === null || type === null) {
      return { valid: false, erro: 'função não recebeu os dados necessarios' };
    }
    //verificação de type do argumento de função
    if (typeof type !== 'string' || !(data instanceof Object)) {
      console.log('teste de erro de type string')
      return { valid: false, erro: 'dado de argumento de função inválida inválido' };
    }

    switch (type) {
      case "login":
        return this.validLogin(data)
        break
    }

  }

  validLogin(data) {
    const { email, senha } = data;
    
    if (email === '' || senha === '') {
      return { valid: false, erro: 'Preencha todos os campos'}
    }

    if (email.match(/[\[{<(#]/)) {
      return { valid: false, erro: 'email inválido' }
    }
    if (senha.match(/[\[{<(]/)) {
      return { valid: false, erro: 'A senha não é válida' }
    }

    for (let exp of this.validEmailCaracter) {
      if (!email.includes(exp)) {
        return { valid: false, erro: 'email não válido' };
      } else {
        return { valid: true, erro: '' };
      }
    }

  }

}

const validation = new Validation()
export default validation