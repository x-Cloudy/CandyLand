import Api from "./request";

class Validation {
  constructor() {

  }

  valid(type = null, data = null) {
    // verifição de argumento de função
    if (data === null || type === null) {
      return { valid: false, erro: 'função não recebeu os dados necessarios' };
    }
    //verificação de type do argumento de função
    if (typeof type !== 'string' || !(data instanceof Object)) {
      console.log('teste de erro de type string')
      return { valid: false, erro: 'dado de argumento de função inválida' };
    }

    switch (type) {
      case "login":
        return this.validLogin(data);
        break

      case "register":
        return this.validRegister(data);
        break

      case "endereco":
        return this.validEndereco(data);
        break
    }

  }

  validEndereco(data) {
    return new Promise((resolve, reject) => {
      const numberString = data.numero.toString()
      console.log(data)
      const variables = {
        bairro: data.bairro,
        cep: data.cep,
        cidade: data.cidade,
        complemento: data.complemento,
        estado: data.estado,
        logradouro: data.logradouro,
        numero: numberString,
        referencia: data.referencia,
        _id: data._id
      }
      const allInputs = ["bairro", "cep", "cidade", "complemento", "estado", "logradouro", "numero", "referencia", "_id"];

      for (let item of allInputs) {
        console.log(console.log(variables[item]))
        if (variables[item] === '' && item !== 'referencia') {
          resolve({isValid: false, erro: `O campo ${item} precisa ser preenchido`})
        }
        
        if (variables[item].match(/[\#[{<(-]/)) {
          resolve({isValid: false, erro: `O campo ${item} não pode conter caracteres especiais`})
        }

        if (variables[item].length > 20 && item !== '_id' && item !== 'logradouro' && item !== 'email') {
          resolve({isValid: false, erro: `O campo ${item} ultrapassou a quantidade máxima de caracteres`})
        }

        if (item === 'email' && variables[item].length > 50) {
          resolve({isValid: false, erro: `O campo ${item} ultrapassou a quantidade máxima de caracteres`})
        }

        if (item === 'logradouro' && variables[item].length > 50) {
          resolve({isValid: false, erro: `O campo ${item} ultrapassou a quantidade máxima de caracteres`})
        }
      }

      resolve({isValid: true, erro: ''})
    })
  }

  async validRegister(data) {
    const variables = {
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      idade: data.idade,
      genero: data.genero,
      cpf: data.cpf,
      telefone: data.telefone,
      senha: data.senha,
      confirmSenha: data.confirmSenha
    } = data;
    const allInputs = ['nome', 'sobrenome', 'email', 'idade', 'genero', 'cpf', 'telefone', 'senha', 'confirmSenha'];
    const emailResult = this.validEmail(variables.email)

    //Verifica se o cpf é válido
    try {
      await this.validCpf(variables.cpf)
    } catch (error) {
      return { valid: error.valid, erro: error.erro }
    }

    //Verifica se os campos estão todos preechidos sem caracteres especiais e com mais de 4 dígitos
    for (let item of allInputs) {
      if (variables[item] === '') {
        return { valid: false, erro: 'Preecha todos os campos' }
      }

      if (variables[item].match(/[\[{<(]/)) {
        return { valid: false, erro: 'Os compos não devem conter caracteres especiais' }
      }

      if (variables[item].length < 4) {
        return { valid: false, erro: `O campo ${item} precisa ter mais de 4 dígitos` }
      }

      if (variables[item].length > 20) {
        return { valid: false, erro: `O campo ${item} ultrapassou o limite de 20 caracteres` }
      }
    }

    //Verifica se o email tem os caracteres básicos para ser válidos
    if (!emailResult) {
      return { valid: false, erro: 'Email inválido' }
    }

    if (variables.senha !== variables.confirmSenha) {
      return { valid: false, erro: 'As duas senhas devem ser iguais' }
    }

    //Verifica se o cpf já está cadastrado no banco de dados
    const cpfValidOnDb = await this.validCpfDb(variables.cpf)
    if (!cpfValidOnDb.valid) {
      return cpfValidOnDb
    }

    const emailValidOnDb = await this.validEmailDb(variables.email)
    if (!emailValidOnDb.valid) {
      return emailValidOnDb
    }

    return { valid: true, erro: '' }
  }

  async validEmailDb(email) {
    const response = await Api.emailVerify(email)
    if (response.data.valid) {
      return { valid: true, erro: '' }
    }
    return { valid: false, erro: 'Email já cadastrado' }
  }

  async validCpfDb(cpf) {
    const response = await Api.cpfVerify(cpf)
    if (response.data.valid) {
      return { valid: true, erro: '' }
    }
    return { valid: false, erro: 'Cpf já cadastrado' }
  }

  validCpf(cpf) {
    return new Promise(async (resolve, reject) => {
      cpf = cpf.replace(/\D/g, '');

      if (cpf.length !== 11) {
        reject({ valid: false, erro: 'cpf inválido' });
      }

      if (/^(\d)\1{10}$/.test(cpf)) {
        reject({ valid: false, erro: 'cpf inválido' });
      }

      // Calcular o primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

      // Calcular o segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

      // Verificar se os dígitos verificadores calculados são iguais aos fornecidos no CPF
      if (parseInt(cpf.charAt(9)) !== digitoVerif1 || parseInt(cpf.charAt(10)) !== digitoVerif2) {
        reject({ valid: false, erro: 'cpf inválido' });
      }

      resolve({ valid: true, erro: '' });
    })
  }

  validLogin(data) {
    const { email, senha } = data;

    if (email === '' || senha === '') {
      return { valid: false, erro: 'Preencha todos os campos' }
    }
    if (email.match(/[\[{<(#]/)) {
      return { valid: false, erro: 'email inválido' }
    }
    if (senha.match(/[\[{<(]/)) {
      return { valid: false, erro: 'A senha não é válida' }
    }
    if (!this.validEmail(email)) {
      return { valid: false, erro: 'Email inválido' }
    }

    return { valid: true, erro: "" }
  }

  //validação de email válido
  validEmail(data) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(data);
  }
}

const validation = new Validation()
export default validation