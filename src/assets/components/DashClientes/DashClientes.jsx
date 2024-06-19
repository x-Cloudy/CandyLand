import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { IoReturnUpBackOutline } from "react-icons/io5";
import Api from "../../../utils/request"
import "./dashClientes.css"

function ShowUsers({ data, userExam }) {

  const UserList = () => {
    return (
      <>
        {data && data.map((item, index) => {
          return (
            <Link to={`/Clientes/${item._id}`} key={index}>
              <li className="client-list">
                <div className="flag"></div>
                <p>Nome: {item.nome + " " + item.sobrenome}</p>
                <p>Email: {item.email}</p>
                <p>Telefone: {item.telefone}</p>
                <p>Genero: {item.genero}</p>
                <p>CPF: {item.cpf}</p>
              </li>
            </Link>
          )
        })}
      </>

    )
  }

  const UserExamine = () => {
    const [item, pedidos] = data;
    const navigate = useNavigate();

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

    return (
      <>
        <li className="client-examine">
          <button onClick={() => navigate('/Clientes')} className="client-examine-backBtn"><IoReturnUpBackOutline /></button>
          <div className="client-examine-infos">
            <p>Nome: {item.nome + " " + item.sobrenome}</p>
            <p>Email: {item.email}</p>
            <p>Telefone: {item.telefone}</p>
            <p>Genero: {item.genero}</p>
            <p>CPF: {item.cpf}</p>
          </div>
          <hr />
          {item.endereco ?
            <div className="dashclient-user-endereco">
              <p>Logradouro: {item.endereco.logradouro}</p>
              <p>Número: {item.endereco.numero}</p>
              <p>Bairro: {item.endereco.bairro}</p>
              <p>Cidade: {item.endereco.cidade}</p>
              <p>Estado: {item.endereco.estado}</p>
              <p>Complemento: {item.endereco.complemento}</p>
              <p>Referencia: {item.endereco.referencia}</p>
              <p>CEP: {item.endereco.cep}</p>
            </div> : <p style={{ height: '150px' }}>Usuário ainda não cadastrou endereço</p>
          }
          <hr />
          <div className="dashclient-user-pedidos">
            <h3>Pedidos</h3>
            <ul>
              {pedidos && pedidos.map((item1, index) => {
                const initialValue = 0;
                const value = item1.product.reduce(
                  (acc, cur) => acc + cur.price, initialValue,
                ).toFixed(2);

                let [color, ptName] = statusColor(item1.status)
                return (
                  <li key={index}>
                    <p>status: <span style={{ color: color }}>{ptName}</span></p>
                    <p>produto: {item1.product.map((item2, index) => {
                      if (index > 0) return;
                      return (
                        <span key={item2._id}>{item2.name}...</span>
                      )
                    })}</p>
                    <p>Data da compra: {new Date(item1.date).toLocaleDateString()}</p>
                    <p>quantidade: {item1.product.length}</p>
                    <p>Valor: {value}</p>
                  </li>
                )
              })}

            </ul>
          </div>
        </li>
      </>
    )
  }

  return (
    <ul className="showUsers">
      {userExam ? <UserExamine /> : <UserList />}
    </ul >
  )
}

export default function DashClientes() {
  const [data, setData] = useState();
  const [userExam, setUserExam] = useState(false)
  const id = useParams();
  useEffect(() => {
    if (id.id !== undefined) {
      Api.loadUserById(id.id)
        .then((response) => {
          setData(prev => prev = [response.data.user, response.data.pedidos])
        })
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
        .finally(() => {
          setUserExam(true)
        })
    } else {
      Api.getAllUsers()
        .then((response) => {
          setData(prev => prev = response.data)
          setUserExam(prev => prev = false)
        })
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
    }
  }, [id])

  return (
    <div className="dashClientes-container">
      <ShowUsers data={data} userExam={userExam} />
    </div>
  )
}