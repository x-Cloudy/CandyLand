import ApiRequests from '../../../utils/request'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './dashGeral.css'

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

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/products'
    }).then(response => setNewData(response.data))
      .catch(err => console.log(err))
  }, [change])

  return (
    <div className='dashgeral-container'>
      <Transaction data={newData} />
      <BestSeller data={newData} />
    </div>
  )
}