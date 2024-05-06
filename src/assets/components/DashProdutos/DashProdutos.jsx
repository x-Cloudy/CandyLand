import { useEffect, useState } from 'react'
import Api from '../../../utils/request'
import './dashProdutos.css'

function DashAllProdutos({ data }) {
  return (
    <div className='dash-all-produtos'>
      <ul>
        {data && data.map((data) => {
          return (
            <li key={data._id} className='dash-all-itens'>
              <img src={data.img} alt={data.name} />
              <div>
                <p>{(data.name).toLowerCase()}</p>
                <p>Preço: {Number((data.price)).toFixed(2)}</p>
              </div>
              <div>
                <p>Promoção: {data.promo ? 'Sim' : 'Não'}</p>
                <p>{data.promo ? `Disconto: ${data.discount}` : ''}</p>
              </div>
              <div>
                <p>Disponível: {data.disponivel}</p>
                <p>Validade: {data.validade}</p>
              </div>

              <div className='dash-all-button-container'>
                <button className='dash-all-button'>Edit</button>
                <button className='dash-all-button' onClick={() => {
                  Api.delete("http://localhost:3000/products", data.id)
                }}>X</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DashController({ setAddPage }) {

  const AddButton = ({ title }) => {
    return (
      <button className='add-produtos'
        onClick={() => setAddPage(true)}>
        {title}
      </button>
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

function InputProduct({ name, title, call, type = 'text' }) {


  return (
    <div>
      <input type={type} name={name} id={name} placeholder={title} onChange={call} />
    </div>
  )
}

function AddPage({ setAddPage }) {
  const [product, setProduct] = useState({
    categoria: '',
    name: '',
    image: '',
    price: 0,
    promo: false,
    discount: '',
    disponivel: '',
    validade: '',
    marca: '',
    peso: '',
    origem: '',
    contem: '',
    texto: '',
    categoria: ''
  })

  const getInfo = (e) => { 
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }

  async function sendToApi(e) {
    e.preventDefault()
    console.log(product)

    const response = await Api.addProduct(product)
    console.log(response)
  }

  return (
    <div className='addpage-container'>
      <div className='addpage'>
        <button onClick={() => setAddPage(false)}>X</button>
        <form>
          <InputProduct name={'name'} title={'Nome'} call={getInfo} />
          <InputProduct name={'price'} title={'Preço'} call={getInfo} />
          <InputProduct name={'promo'} title={'Em Promoção'} call={getInfo} />
          <InputProduct name={'discount'} title={'Disconto'} call={getInfo} />
          <InputProduct name={'disponivel'} title={'Quantidade'} call={getInfo} />
          <InputProduct name={'validade'} title={'Validade'} call={getInfo} />
          <InputProduct name={'marca'} title={'Marca'} call={getInfo} />
          <InputProduct name={'peso'} title={'peso'} call={getInfo} />
          <InputProduct name={'origem'} title={'Origem'} call={getInfo} />
          <InputProduct name={'contem'} title={'Contem Glutem'} call={getInfo} />
          <InputProduct name={'texto'} title={'Descrição'} call={getInfo} />
          <InputProduct name={'categoria'} title={'Categoria'} call={getInfo} />
          <InputProduct name={'image'} title={'Imagem'} type={'file'} call={getInfo} />

          <button onClick={sendToApi}>ADICIONAR</button>
        </form>
      </div>
    </div>
  )
}

export default function DashProdutos() {
  const [data, setData] = useState()
  const [change, setChange] = useState({})
  const [addPage, setAddPage] = useState(false)

  useEffect(() => {
    Api.get("products")
      .then(response => setData(response.data))
      .catch(err => console.log(err))
  }, [change])

  return (
    <div className='dash-produtos-container'>
      <h5>Todos os produtos</h5>
      <div className='dash-produtos'>
        <DashAllProdutos data={data} />
        <DashController setAddPage={setAddPage} />
      </div>
      {addPage && <AddPage setAddPage={setAddPage} />}
    </div>
  )
}