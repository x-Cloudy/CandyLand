import axios from 'axios'
import { ApiRequests } from './request';

class Payment extends ApiRequests {
  constructor(url) {
    super();
    this.baseURL = url;
  }

  async createPayment(data, id) {
    
    const response = await axios({
      method: "POST",
      url: this.baseURL + '/createPayment',
      data: {
        data,
        id
      },
    })
    return response;
  }

}

// https://candyland-store.com/api
const payment = new Payment('http://localhost:4000/api')
export default payment;