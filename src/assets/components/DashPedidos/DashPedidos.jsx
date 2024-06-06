import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { IoReturnUpBackOutline } from "react-icons/io5";
import Api from "../../../utils/request"
import "./dashPedidos.css"

export default function DashPedidos() {
  const [data, setData] = useState()
  const [oneData, setOneData] = useState()
  const [pedidoExem, setPedidoExam] = useState(false)
  const id = useParams().id;

  useEffect(() => {
    if (id) {
      Api.getOnePedido(id)
        .then(response => {
          setData(prev => prev = '')
          setOneData(prev => prev = response.data)
        })
        .catch(err => console.log(err))
        .finally(setPedidoExam(true))
    } else {
      Api.getAllPedidos()
        .then(response => {
          setData(prev => prev = response.data)
          setPedidoExam(prev => prev = false)
        })
        .catch(err => console.log(err))
    }
  }, [id])

  const AllPedidos = () => {

    function statusColor(status) {
      switch (status) {
        case "pending":
          return "orange"
          break;

        case "success":
          return "green"
          break;

        case "failure":
          return "red"
          break
      }
    }

    return (
      <>
        {data && data.map((item, index) => {
          const initialValue = 0;
          const color = statusColor(item.status);
          const total_price = item.product.reduce((acc, cur) => acc + cur.price, initialValue).toFixed(2);

          return (
            <Link to={`/Pedidos/${item._id}`} key={index}>
              <li>
                <div className="allPedidos-status" style={{ background: color }}></div>
                <p style={{ marginRight: '15px' }}>{index + 1}#</p>
                <div className="allPedidos-infos">
                  <p>{item.status}</p>
                  <p>data: {new Date(item.date).toLocaleDateString()}</p>
                  <p>valor: {total_price}</p>

                </div>
                <hr />
                <div className="allPedidos-infos" style={{ marginLeft: '15px' }}>
                  <p>nome: {item.user.nome}</p>
                  <p>email: {item.user.email}</p>
                  <p>telefone: {item.user.telefone}</p>
                </div>
              </li>
            </Link>
          )
        })}
      </>
    )
  }

  const OnePedido = () => {
    const navigate = useNavigate()
   
    return (
      <div className="onePedido-container">
        <button onClick={() => navigate('/Pedidos')} className="client-examine-backBtn" style={{ marginBottom: '20px' }}><IoReturnUpBackOutline /></button>
        {oneData &&
          <div className="onePedido">
            <div className="pedido-examine-infos">
              <p>Nome: {oneData.user.nome + " " + oneData.user.sobrenome}</p>
              <p>Email: {oneData.user.email}</p>
              <p>Telefone: {oneData.user.telefone}</p>
              <p>Genero: {oneData.user.genero}</p>
              <p>CPF: {oneData.user.cpf}</p>
            </div>
            <hr />
            {oneData.user.endereco &&
              <div className="pedido-user-endereco">
                <p>Logradouro: {oneData.user.endereco.logradouro}</p>
                <p>Número: {oneData.user.endereco.numero}</p>
                <p>Bairro: {oneData.user.endereco.bairro}</p>
                <p>Cidade: {oneData.user.endereco.cidade}</p>
                <p>Estado: {oneData.user.endereco.estado}</p>
                <p>Complemento: {oneData.user.endereco.complemento}</p>
                <p>Referencia: {oneData.user.endereco.referencia}</p>
                <p>CEP: {oneData.user.endereco.cep}</p>
              </div>}
            <hr />
            <div className="pedidos-infos">
              <div className="pedidos-infos-compra">
                <p>status: {oneData.status}</p>
                <p>data da compra: {new Date(oneData.date).toLocaleDateString()}</p>
                <p>mercado pago ID: {oneData.id_mercado_pago}</p>
                <p>items comprados: {oneData.product.length}</p>
              </div>

              <div className="pedidos-infos-item">
                {oneData.product && oneData.product.map((item, index) => {
                  return (
                    <div key={index} className="pedido-item">
                      <p>nome: {item.name}</p>
                      <p>preço: {item.price}</p>
                      <p>promoção: {item.promo ? 'sim' : 'não'}</p>
                      <p>quantidade</p>
                      <p>disconto: {item.discount ? item.discount : 0}%</p>
                      {<p>preço com desconto: {item.price - ((item.price * item.discount) / 100)}</p>}
                      <p>id: {item._id}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  return (
    <div className="dashPedidos-container">
      <ul>
        {pedidoExem ? <OnePedido /> : <AllPedidos />}
      </ul>
    </div>
  )
}