import ApiRequests from '../../../utils/request'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './dashGeral.css'

function DashAllProdutos({ data }) {
  return (
    <div className='dash-all-produtos'>
      <ul>
        {data && data.map((item) => {
          return (
            <li key={item.id} className='dash-all-itens'>
              <img src={item.img} />
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>Promoção {item.promo ? 'Sim' : 'Não'}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Transaction = ({ data }) => {
  return (
    <div className='transaction-container'>
      <h5>Vendas Recentes</h5>
      <ul>
        {data && data.map((data) => {
          return (
            <li key={data.id} className='transaction-item'>
              <img src={data.img} alt={data.name} />
              <p>{data.name}</p>
            </li>
          )
        })}
      </ul>

    </div>
  )
}

const BestSeller = ({ data }) => {
  return (
    <div className='bestSeller-container'>
      <h5>Mais Vendidos</h5>
      <ul>
        {data && data.map((data, index) => {
          return (
            <li key={data.id} className='bestSeller-item'>
              <p>{index + 1}</p>
              <img src={data.img} alt={data.name} />
              <p>{data.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function DashGeral() {
  const [newData, setNewData] = useState()
  const [change, setChange] = useState({})
  const api = new ApiRequests(setChange)

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/products'
    }).then(response => setNewData(response.data))
  }, [change])

  return (
    <div className='dashgeral-container'>
      <DashAllProdutos data={newData} />
      <BestSeller data={newData} />
    </div>
  )
}