import axios from 'axios'

class ApiRequests {
  constructor(baseURL, att) {
    this.instance = axios.create({
      baseURL: baseURL
    })
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

  async register(data) {
    return axios({
      method: "POST",
      url: this.baseURL + "/register",
      data: data
    })
  }

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

  async login(data) {
    try {
      await this.instance.post('/login', data).then((response) => {
        window.localStorage.setItem('token', response.data.accessToken)
        window.localStorage.setItem('id', response.data.id)
      })
    } catch (err) {
      console.log('API-login', err)
    }
  }

  logout() {
    window.localStorage.clear()
    window.location.reload()
  }

  getJwt() {
    return new Promise((resolve, reject) => {
      const jwt = window.localStorage.getItem('token')

      if (jwt) {
        resolve(jwt)
      } else {
        reject('')
      }
    })
  }

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
    } catch(err) {
    }
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