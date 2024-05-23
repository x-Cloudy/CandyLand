import Api from '../../../utils/request'
import { useEffect, useState } from 'react'
import './dashGeral.css'

const Transaction = ({ data }) => {

  return (
    <div className='transaction-container'>
      <h5>Vendas Recentes</h5>
      <ul>
        {data && data.map((data) => {

          return (
            <li key={data._id} className='transaction-item'>
              <img src={data.image.src} alt={data.name} />
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
            <li key={data._id} className='bestSeller-item'>
              <p>{index + 1}</p>
              <img src={data.image.src} alt={data.name} />
              <p style={{width: "100px"}}>{data.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function DashGeral() {
  const [newData, setNewData] = useState()

  useEffect(() => {
    Api.get("products")
      .then(response => {
        setNewData(response.data)
      })
      .catch(e => console.log(e))
  }, [])

  return (
    <div className='dashgeral-container'>
      <Transaction data={newData} />
      <BestSeller data={newData} />
    </div>
  )
}