import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Api from "../../../utils/request"
import "./dashPedidos.css"

export default function DashPedidos() {
  const [data, setData] = useState()
  const [pedidoExem, setPedidoExam] = useState(false)
  const id = useParams().id;

  useEffect(() => {
    if (id) {
      Api.getOnePedido(id)
        .then(response => setData(prev => prev = response.data))
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
    console.log(data)
    
    function statusColor(status) {
      switch (status) {
        case "pendente":
          return "orange"
          break;

        case "aprovado":
          return "green"
          break;

        case "recusado":
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
                <div className="allPedidos-status" style={{background: color}}></div>
                <p style={{marginRight: '15px'}}>{index + 1}#</p>
                <div className="allPedidos-infos">
                  <p>{item.status}</p>
                  <p>data: {new Date(item.date).toLocaleDateString()}</p>
                  <p>valor: {total_price}</p>
                </div>
                <hr />
                <div className="allPedidos-infos" style={{marginLeft: '15px'}}>
                  <p>nome: {item.user.nome}</p>
                </div>
              </li>
            </Link>
          )
        })}
      </>
    )
  }

  const OnePedido = () => {
    console.log(data)
    return (
      <div>

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