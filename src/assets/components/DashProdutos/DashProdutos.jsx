import { useEffect, useState } from 'react'
import ApiRequests from '../../../utils/request'
import axios from 'axios'
import './dashProdutos.css'

function DashAllProdutos({ data }) {
  return (
    <div className='dash-all-produtos'>
      <ul>
        {data && data.map((item) => {
          return (
            <li key={item.id} className='dash-all-itens'>
              <img src={item.img} />
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>Promoção {item.promo ? 'Sim' : 'Não'}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DashController() {

  const AddButton = ({ title }) => {
    return (
      <button className='add-produtos'>{title}</button>
    )
  }

  const DashFilter = () => {

    const DashFilterInput = ({ id, name }) => {
      return (
        <div className='dash-filter-input'>
          <input type="checkbox" name={id} id={id} />
          <label htmlFor={id}>{name}</label>
        </div>
      )
    }

    return (
      <div className='dash-produtos-filter'>
        <form action='#' name='filter' id='filter'>
          <DashFilterInput id={'chocolate'} name={'Chocolate'} />
          <DashFilterInput id={'biscoito'} name={'Biscoito'} />
          <DashFilterInput id={'bala'} name={'Bala'} />
          <DashFilterInput id={'bebida'} name={'Bebida'} />
          <DashFilterInput id={'conveniencia'} name={'Conveniência'} />
          <DashFilterInput id={'snacks'} name={'Snaks'} />
          <DashFilterInput id={'coreano'} name={'Coreanos'} />
          <DashFilterInput id={'novidade'} name={'Novidades'} />
          <DashFilterInput id={'promocao'} name={'Promoções'} />

          <button type='submit'>Filtrar</button>
        </form>
      </div>
    )
  }

  return (
    <div className='dash-controller-produtos'>
      <AddButton title={'Adicionar Produto'} />
      <AddButton title={'Adicionar Categorias'} />
      <DashFilter />
    </div>
  )
}

export default function DashProdutos() {
  const [data, setData] = useState()

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/products'
    }).then(response => setData(response.data))
  }, [])

  return (
    <div className='dash-produtos-container'>
      <h5>Todos os produtos</h5>

      <div className='dash-produtos'>
        
        <DashAllProdutos data={data} />
        <DashController />
      </div>
    </div>
  )
}