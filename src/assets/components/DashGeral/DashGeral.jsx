import Api from '../../../utils/request'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './dashGeral.css'

function statusColor(status) {
  switch (status) {
    case "pending":
      return ["orange", "Pedente"]
      break;

    case "approved":
      return ["green", "Aprovado"]
      break;

    case "transport":
      return ["green", "Em Transporte"]
      break;

    case "rejected":
      return ["red", "Rejeitado"]
      break;
  }
}

const Transaction = ({ data }) => {
  return (
    <div className='transaction-container'>
      <h5>Vendas Recentes</h5>
      <ul>
        {data && data.map((data) => {
          const allPrice = data.product.reduce((acc, cur) => acc + cur.price, 0);
          const itemQuantity = data.product_quantity.reduce((acc, cur) => acc + cur, 0);
          const [color, ptStatus] = statusColor(data.status);
          return (
            <li key={data._id} className='transaction-item'>
              <Link to={`/Pedidos/${data._id}`}>
                {data.product.length > 0 && <img src={data.product[0].image.src} alt={data.product[0].name} />}
              </Link>
              <div className='transaction-grid'>
                <p>Status: <span style={{ color: color, fontWeight: "bold" }}>{ptStatus}</span></p>
                <p>Comprador: <span>{data.user.nome} {data.user.sobrenome}</span></p>
                <p>Valor: {allPrice.toFixed(2)}</p>
                <p>Produtos comprados: {itemQuantity}</p>
                <p>Telefone: {data.user.telefone}</p>
                <p>Telefone: {data.user.email}</p>
                <p>Dia da Compra: {new Date(data.date).toLocaleDateString()}</p>
                <p>Rastreio: {data.rastreio}</p>
              </div>

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
              {<img src={data.image.src} alt={data.name} />}
              <p style={{ width: "100px" }}>{data.name}</p>
              <p>Vendas: {data.vendas}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function DashGeral() {
  const [newData, setNewData] = useState();
  const [topSales, setTopSales] = useState();

  useEffect(() => {
    Api.getAllPedidos()
      .then(response => {
        setNewData(response.data.reverse())
      })
      .catch(e => console.log("Ocorreu um erro ao carregar!"))
  }, [])

  useEffect(() => {
    Api.getTopSales()
      .then(response => {
        setTopSales(response.data)
      })
      .catch(e => console.log("Ocorreu um erro ao carregar!"))
  }, [])

  return (
    <div className='dashgeral-container'>
      <Transaction data={newData} />
      <BestSeller data={topSales} />
    </div>
  )
}