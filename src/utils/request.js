import React from 'react';
import axios from 'axios'

class ApiRequests {
  constructor(baseURL, att) {
    this.atualiza = att;
    this.baseURL = baseURL;
  }

  sleep() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 5000)
    })
  }

  //Registra usuário no banco
  async register(data) {
    return axios({
      method: "POST",
      url: this.baseURL + "/register",
      data: data
    })
  }

  //Registra o endereço de usuário no banco
  async sendAddress(data) {
    const id = localStorage.getItem('id');
    const jwt = await this.getJwt()

    if (!id || !jwt) return

    const response = await axios({
      method: "POST",
      url: "https://localhost:4000/userEndereco",
      data: {
        id: id,
        endereco: data
      },
      headers: {
        "Authorization": jwt
      }
    })

    window.location.reload()
    return response;
  }

  //Pega os dados do usuário no banco de dados
  async loadUserData() {
    const jwt = await this.getJwt();
    const id = window.localStorage.getItem('id');
    // Retorna os dados do user
    return await axios({
      method: "POST",
      url: this.baseURL + "/user",
      data: {
        id: id
      },
      headers: {
        "Authorization": jwt
      }
    })
  }

  //Loga usuário e gera um jwt
  async login(data) {
     await axios({
        method: "POST",
        url: this.baseURL + "/login",
        data: data
      }).then((response) => {
        window.localStorage.setItem('token', response.data.accessToken)
        window.localStorage.setItem('id', response.data.id)
      })
  }

  //Desgola o usuário excluid o jwt
  logout() {
    window.localStorage.clear()
    window.location.reload()
  }

  //Pega e desencripta o jwt
  getJwt() {
    return new Promise((resolve, reject) => {
      const jwt = window.localStorage.getItem('token')

      //função futura para desencripitar o jwt

      if (jwt) {
        resolve(jwt)
      } else {
        reject('')
      }
    })
  }

  //Verifica se o jwt é válido
  async verify() {
    try {
      const jwt = await this.getJwt()
      if (!jwt) return

      const result = await axios({
        method: 'POST',
        url: this.baseURL + "/verify",
        headers: {
          "Authorization": jwt
        }
      })
      return result.status === 201 ? true : false;
    } catch (err) {
    }
  }

  //Verifica se o email já está cadastrado no db
  async emailVerify(email) {
    return await axios({
      method: "POST",
      url: this.baseURL + "/emailVerify",
      data: {
        email: email
      }
    })
  }

  //Verifica se o cpf já está cadastrado no db
  async cpfVerify(cpf) {
   return await axios({
        method: "POST",
        url: this.baseURL + "/cpfVerify",
        data: {
          cpf: cpf
        }
      })
  }

  async get(url) {
    return await axios({
      method: 'GET',
      url: url
    })
  }

  async post(url, data) {
    await axios({
      method: 'POST',
      url: url,
      data: data
    })
    console.log('post enviado')
    this.atualiza({})
  }

  async delete(url, id) {
    await axios({
      method: 'DELETE',
      url: url + `/${id}`,
    })
    console.log(`Produto excluido`)
    this.atualiza({})
  }

}

const Api = new ApiRequests('https://localhost:4000')
export default Api