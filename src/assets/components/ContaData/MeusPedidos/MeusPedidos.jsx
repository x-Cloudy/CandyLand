import './meusPedidos.css'

const PedidosNav = ({ dataSize }) => {
  return (
    <div className='pedidos-nav'>
      <p>{dataSize > 0 ? 'Pedidos: ' : 'Nenhum Pedido: '}{dataSize}</p>
    </div>
  )
}

export default function MeusPedidos({ data }) {

  return data ? <div className='meus-pedidos-container'>
    <h5> Pedidos</h5 >
    <PedidosNav dataSize={data.pedidos.length} />
    <div className='pedidos-lista'>
      {data.pedidos.map((item) => {
        return (
          <div className='pedidos-item' key={item.id}>
            <div className='pedidos-item-top'>
              <div className='pedido-data'>
                <p>PEDIDO REALIZADO</p>
                <p>{item.data}</p>
              </div>

              <div className='pedido-numero'>
                <p>PEDIDO Nº {item.numero_pedido}</p>
              </div>
            </div>

            <div className='pedidos-item-bottom'>
              <div className='pedido-info'>
                <img src={item.img} alt={item.nome} />
                <div className='pedido-info-desc'>
                  <p>{item.nome}</p>
                  <p>Marca: {item.marca}</p>
                  <p>Origem: {item.origem}</p>
                </div>
              </div>

              <button>Exibir</button>
            </div>
          </div>
        )
      })}
    </div>
  </div > : <p>Carregando...</p>
}
