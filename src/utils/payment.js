import axios from 'axios'
import { ApiRequests } from './request';

class Payment extends ApiRequests {
  constructor(url) {
    super();
    this.baseURL = url;
  }

  async createPayment(data, id) {
    const jwt = await super.getJwt()
    
    const response = await axios({
      method: "POST",
      url: this.baseURL + '/createPayment',
      data: {
        data,
        id
      },
      headers: {
        "Authorization": jwt
      }
    })
    return response;
  }

}

const payment = new Payment('http://localhost:4000/api')
export default payment;