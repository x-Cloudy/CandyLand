import axios from 'axios'
import { ApiRequests } from './request';

const body = {
  items: [
    {
      id: '1234',
      title: 'Dummy Title',
      category_id: 'car_electronics',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: 10,
    },
  ],
  payer: {
    name: 'Test',
    surname: 'User',
    email: 'your_test_email@example.com',
    phone: {
      area_code: '11',
      number: '4444-4444',
    },
    identification: {
      type: 'CPF',
      number: '19119119100',
    },
  },
  back_urls: {
    success: 'http://test.com/success',
    failure: 'http://test.com/failure',
    pending: 'http://test.com/pending',
  },
  differential_pricing: {
    id: 1,
  },
  expires: false,
  auto_return: 'all',
  statement_descriptor: 'Test Store',
};


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
    console.log(response)
    return response;
  }

}

const payment = new Payment('https://localhost:4000')
export default payment;