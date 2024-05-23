import { useEffect, useState } from "react"
import Api from "../../../utils/request"
import "./dashClientes.css"

function ShowUsers({ data }) {
  console.log(data)
  return (
    <ul className="showUsers">
      {data && data.map((item, index) => {
        return (
          <li key={index}>
            <p>Nome: {item.nome + " " + item.sobrenome}</p>
            <p>Email: {item.email}</p>
            <p>Telefone: {item.telefone}</p>
            <p>Genero: {item.genero}</p>
            <p>Pedidos {item.meus_pedidos.length}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default function DashClientes() {
  const [data, setData] = useState();

  useEffect(() => {
    Api.getAllUsers()
      .then(response => setData(response.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="dashClientes-container">
      <ShowUsers data={data} />
    </div>
  )
}