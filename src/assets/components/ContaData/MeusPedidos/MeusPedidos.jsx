import { useEffect, useState } from 'react'
import Api from '../../../../utils/request'
import './meusPedidos.css'

const PedidosNav = ({ dataSize }) => {
  return (
    <div className='pedidos-nav'>
      <p>{dataSize > 0 ? 'Pedidos: ' : 'Nenhum Pedido: '}{dataSize}</p>
    </div>
  )
}

export default function MeusPedidos({ data }) {
  const [orders, setOrders] = useState();
  let debaunce = false;
  useEffect(() => {
    if (debaunce) return
    debaunce = true;
    Api.getUserPedidos(data._id)
      .then(response => setOrders(response.data))
      .catch(err => console.log(err))
      .finally(() => {
        debaunce = false;
      })
  }, [])

  return orders ? <div className='meus-pedidos-container'>
    <h5> Pedidos</h5 >
    <PedidosNav dataSize={orders.length} />
    <div className='pedidos-lista'>
      {console.log(orders)}
      {orders && orders.map((item, index) => {
        let color;
        function colorStatus(status) {
          switch (status) {
            case "pendente":
              color = "orange"
              break;

            case "success":
              color = "green"
              break;

            case "failure":
              color = "red"
              break;

            default:
              break;
          }
        }
        colorStatus(item.status)

        return (
          <div className='pedidos-item' key={item._id}>
            <div className='pedidos-item-top'>
              <div className='pedido-data'>
                <p>Pedido em {new Date(item.date).toLocaleDateString()}</p>
                <p>Status: <span style={{ color: color }}>{item.status}</span></p>
              </div>

              <div className='pedido-numero'>
                <p>PEDIDO Nº {index + 1}</p>
              </div>
            </div>
            {item.product.map((prod, index) => {

              return (
                <div className='pedidos-item-bottom' key={index}>
                  <div className='pedido-info'>
                    <img src={prod.image.src} alt={prod.name} />
                    <div className='pedido-info-desc'>
                      <p>Produto: {prod.name}</p>
                      <p>Marca: {prod.marca}</p>
                      <p>Origem: {prod.origem}</p>
                      <p>Preço: <span style={{ color: '#BDD753' }}>{prod.price} R$</span></p>
                    </div>
                  </div>

                  <button>Exibir</button>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  </div > : <p>Carregando...</p>
}
