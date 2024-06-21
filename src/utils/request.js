import axios from 'axios'

export class ApiRequests {
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
    const jwt = await this.verify()

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
    const id = window.localStorage.getItem('id');
    // Retorna os dados do user
    try {
      return await axios({
        method: "POST",
        url: this.baseURL + "/user",
        data: {
          id: id
        },
      })
    } catch (e) {
      return e
    }

  }

  async loadUserById(id) {
    return axios({
      method: "GET",
      url: this.baseURL + `/users/${id}`,
    })
  }

  async getAllUsers() {
    const id = localStorage.getItem("id");

    return axios({
      method: "POST",
      url: this.baseURL + "/users",
      data: {
        id: id
      }
    })
  }

  async getOnePedido(id) {

    return axios({
      method: "GET",
      url: this.baseURL + `/pedidos/${id}`,
    })
  }

  async getAllPedidos() {

    return axios({
      method: "GET",
      url: this.baseURL + "/pedidos",
    })
  }

  async getTopSales() {
    const id = localStorage.getItem("id");

    return axios({
      method: "GET",
      url: this.baseURL + "/topSales",
      params: {
        id: id
      }
    })
  }

  async getUserPedidos(id) {
    return await axios({
      method: "GET",
      url: this.baseURL + "/userPedidos",
      params: { id }
    })
  }

  async dashSearch(input) {
    const jwt = await this.verify();
    const id = localStorage.getItem("id");
    if (!jwt || !id) return;

    return await axios({
      method: "GET",
      url: this.baseURL + "/dashSearch",
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        id: id,
        search: input
      }
    })
  }

  //Loga usuário e gera um jwt
  async login(data) {
    await axios({
      method: "POST",
      url: this.baseURL + "/login",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      window.localStorage.setItem('id', response.data.id)
    }).catch("Ocorreu um erro ao carregar login!")
  }

  async addProduct(data, image) {
    // valdation
    const jwt = await this.verify()
    const id = localStorage.getItem("id")

    if (!jwt) {
      this.logout()
    }

    try {
      return await axios({
        method: "POST",
        url: this.baseURL + "/products",
        data: {
          main: data,
          image: image,
          id: id
        },
        headers: {
          "Authorization": jwt
        }
      })
    } catch (e) {
      console.log("Ocorreu um erro ao carregar addProduct!")
    }
  }

  async attProduct(id, data) {
    const jwt = await this.verify()

    if (!jwt) return

    return await axios({
      method: "POST",
      url: this.baseURL + "/productEdit",
      data: {
        id: id,
        newData: data
      }
    })
  }

  async addImage(body) {
    return axios({
      method: "POST",
      url: this.baseURL + "/image",
      data: body
    })
  }

  // Adiciona um produto aos favoritos do do usuário
  async addFavoritos(favoritoId) {
    const jwt = await this.verify()
    const id = localStorage.getItem("id");
    if (!id || !jwt) return

    return await axios({
      method: "POST",
      url: this.baseURL + "/favoritos",
      data: {
        id: id,
        productId: favoritoId
      },
    })
  }

  async removeFavoritos(favoritoId) {
    const jwt = await this.verify()
    const id = localStorage.getItem("id");
    if (!id || !jwt) return

    return await axios({
      method: "POST",
      url: this.baseURL + "/deleteFavorito",
      data: {
        id: id,
        productId: favoritoId
      }
    })
  }

  // Edita uma compra realizada
  async editPayment(order_id, content) {
    const id = localStorage.getItem("id");
    if (!id) return console.log("Parou no id return");
    try {
      const response = await axios({
        method: "PUT",
        url: this.baseURL + "/editPayment",
        data: {
          order_id: order_id,
          content: content,
          id: id
        }
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  //Desgola o usuário excluid o jwt
  logout() {
    axios({
      method: "POST",
      url: this.baseURL + "/logout"
    }).then((response) => {
      localStorage.clear()
      window.location.reload()
    }).catch((err) => {
      console.log("Ocorreu um erro ao carregar logout!")
    })

  }

  //Verifica se o jwt é válido
  async verify() {
    const result = await axios({
      method: 'POST',
      url: this.baseURL + "/verify",
    })
    if (result.status && result.status === 200) {
      return true;
    } else if (result.response.status && result.response.status === 401) {
      return false
    } else {
      return false;
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

  async searchNewProducts() {
    try {
      return axios({
        method: "GET",
        url: this.baseURL + "/getNewProd"
      })
    } catch (error) {
      console.log("Ocorreu um erro ao carregar searchNewProducts!")
    }
  }

  async getPromos() {
    try {
      return axios({
        method: "GET",
        url: this.baseURL + "/getPromo"
      })
    } catch (error) {
      console.log("Ocorreu um erro ao carregar getPromos!")
    }
  }

  async searchCategoria(prod) {
    try {
      return await axios({
        method: "GET",
        url: this.baseURL + `/categoria/${prod}`,
      })
    } catch (error) {
      console.log("Ocorreu um erro ao carregar searchCategorias!")
    }
  }

  async searchInput(search) {
    try {
      return await axios({
        method: "GET",
        url: this.baseURL + `/search/${search}`
      })
    } catch (e) {
      return e
    }
  }

  async get(type) {
    return await axios({
      method: 'GET',
      url: this.baseURL + `/${type}`
    })
  }

  async delete(id_produto, id_image, src_image) {

    await axios({
      method: 'DELETE',
      url: this.baseURL + `/products/${id_produto}`,
      data: {
        imageId: id_image,
        imageSrc: src_image
      },
    })
  }

}

const Api = new ApiRequests('http://localhost:4000/api')
export default Api