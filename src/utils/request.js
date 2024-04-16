import axios from 'axios'

export default class ApiRequests {
  constructor(att) {
    this.atualiza = att;
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
      url: url+`/${id}`,
    })
    console.log(`Produto excluido`)
    this.atualiza({})
  }

}