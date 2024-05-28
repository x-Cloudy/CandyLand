import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashAllProdutos, EditPage } from '../DashProdutos/DashProdutos'
import './dashSearch.css'

export default function DashSearch({ data, setData }) {
  const navigate = useNavigate()
  const [editPage, setEditPage] = useState({
    active: false,
    data: null
  })

  console.log(data)
  return (
    <div className='dashSearch-container'>
      {editPage.active && <EditPage props={{ editPage, setEditPage }} style={{transform: 'traslate(-50px, 0px)'}}/>}
      {data.user.length > 0 &&
        <div className='dashSearch-user-container'>
          <h3>Usuários</h3>
          <div className='dashSearch-scroll'>
            {data.user.map((item, index) => {
              return (
                <div className='dashSearch-scroll-item' key={index} onClick={() => {
                  navigate(`/Clientes/${item._id}`)
                  setData((prev) => prev = {
                    user: [],
                    product: []
                  })
                  }}>
                  <p>Nome: {item.nome + ' ' + item.sobrenome}</p>
                  <p>Email: {item.email}</p>
                  <p>telefone: {item.telefone}</p>
                </div>
              )
            })}
          </div>
        </div>
      }

      {data.product.length > 0 &&
        <div className='dashSearch-product-container'>
          <h3>Produtos</h3>
          <div className='dashSearch-scroll' style={{display: "flex" ,justifyContent: "center"}}>
            <DashAllProdutos data={data.product} edit={setEditPage}/>
          </div>
        </div>
      }

    </div>
  )
}