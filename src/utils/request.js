import axios from 'axios'
import fs from 'node:fs'

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
    try {
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
    } catch (e) {
      return e
    }

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

  async addProduct(data, image) {
    // valdation
    const jwt = await this.getJwt()

    if (!jwt) {
      this.logout()
    }

    try {
      return await axios({
        method: "POST",
        url: this.baseURL + "/products",
        data: {
          main: data,
          image: image
        },
        headers: {
          "Authorization": jwt
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // Adiciona um produto aos favoritos do do usuário
  async addFavoritos(favoritoId) {
    try {
      const jwt = await this.getJwt()
      const id = localStorage.getItem("id");

      if (!id || !jwt) return

      return await axios({
        method: "POST",
        url: this.baseURL + "/favoritos",
        data: {
          id: id,
          productId: favoritoId
        },
        headers: {
          "Authorization": jwt
        }
      })
    } catch (e) {
      console.log(e)
    }
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

  async searchCategoria(prod) {
    try {
      return await axios({
        method: "GET",
        url: this.baseURL + `/categoria/${prod}`,
      })
    } catch (error) {
      console.log(error)
    }

  }

  async get(type) {
    return await axios({
      method: 'GET',
      url: this.baseURL + `/${type}`
    })
  }

  async delete(id_produto, id_image, src_image) {
    const jwt = await this.getJwt();

    await axios({
      method: 'DELETE',
      url: this.baseURL + `/products/${id_produto}`,
      data: {
        imageId: id_image,
        imageSrc: src_image
      },
      headers: {
        "Authorization": jwt
      }
    })
    console.log(`Produto excluido`)
  }

}

const Api = new ApiRequests('https://localhost:4000')
export default Api