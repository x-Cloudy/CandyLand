import { useEffect, useState, useContext } from 'react'
import Api from '../../../../utils/request'
import CircularColor from '../../Loading/Loading'
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
    if (!data) return
    Api.getUserPedidos(data._id)
      .then(response => setOrders(response.data.reverse()))
      .catch(err => console.log("Ocorreu um erro ao carregar!"))
      .finally(() => {
        debaunce = false;
      })
  }, [])


  return orders ? <div className='meus-pedidos-container'>
    <h5> Pedidos</h5 >
    <PedidosNav dataSize={orders.length} />
    {orders.length < 1 && <div style={{height: "300px"}}></div>}
    <div className='pedidos-lista'>
      {orders && orders.map((item, index) => {
        let color;
        let ptStatus;
        function colorStatus(status) {
          switch (status) {
            case "pending":
              color = "orange"
              ptStatus = "Pendente"
              break;

            case "approved":
              color = "green"
              ptStatus = "Aprovado"
              break;

            case "rejected":
              color = "red"
              ptStatus = "Rejeitado"
              break;

            case "transport":
              color = "green"
              ptStatus = "Em Transporte"
              break;

            case "Entregue":
              color = "blue"
              ptStatus = "Entregue"
              break;
          }
        }
        colorStatus(item.status)

        return (
          <div className='pedidos-item' key={item._id}>
            <div className='pedidos-item-top'>
              <div className='pedido-data'>
                <p>Pedido em {new Date(item.date).toLocaleDateString()}</p>
                <p>Status: <span style={{ color: color }}>{ptStatus}</span></p>
                {item.rastreio && <p>Código de rastreio: {item.rastreio}</p>}
              </div>

              <div className='pedido-numero'>
                {ptStatus === "Pendente" && <button className='pedidos-payment-button' onClick={() => {
                  window.location.href = item.payment_link
                }}>Pagar</button>}
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
                      <p>Preço: <span style={{ color: '#BDD753' }}>{prod.price.toFixed(2)} R$</span></p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  </div > : <div className='loading-meus-pedidos'><CircularColor /></div>
}
