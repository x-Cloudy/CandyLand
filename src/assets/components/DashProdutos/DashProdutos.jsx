import { useEffect, useRef, useState } from 'react'
import Api from '../../../utils/request'
import './dashProdutos.css'

async function itemDelete(data) {
  await Api.delete(data._id, data.image._id, data.image.src)
}

function DashAllProdutos({ data }) {

  return (
    <div className='dash-all-produtos'>
      <ul>
        {data && data.map((data) => {
          return (
            <li key={data._id} className='dash-all-itens'>
              <img src={data.image.src} alt={data.name} />
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
                <button className='dash-all-button' onClick={() => itemDelete(data)}>X</button>
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

function InputProduct({ name, title, call, type = 'text', refe }) {
  return (
    <div>
      {type === 'text' &&
        <>
          <label htmlFor={name}>{title}</label>
          <input
            type={type}
            name={name}
            id={name}
            onChange={call}
            ref={refe}
            className='addpage-input'
          />
        </>}

      {type === 'select' &&
        <>
          <label htmlFor={name}>{title + " ?"}</label>
          <select
            type={type}
            name={name}
            id={name}
            placeholder={title}
            onChange={call}
            ref={refe}
            className='addpage-input'
          >
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </>}

      {type === 'date' &&
        <>
          <label htmlFor={name}>{title}</label>
          <input
            type={type}
            name={name}
            id={name}
            placeholder={title}
            onChange={call}
            ref={refe}
            className='addpage-input'
          />
        </>}


      {type === 'file' &&
        <>
          <label htmlFor={name}>{title}</label>
          <input
            type={type}
            name={name}
            id={name}
            onChange={call}
            ref={refe}
            style={{ width: '100%', gridColumnStart: '1', gridColumnEnd: '4' }}
          />
        </>}
    </div>
  )
}

function AddPage({ setAddPage }) {
  const fileRef = useRef()
  const [product, setProduct] = useState({
    categoria: '',
    name: '',
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
    categoria: '',
  })

  const getInfo = (e) => {
    if (e.target.name === 'image') {
      return
    }

    if (e.target.name === 'price') {
      setProduct({
        ...product,
        [e.target.name]: parseFloat(e.target.value.replace(",", "."))
      })
      return
    }

    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }



  async function sendToApi(e) {
    e.preventDefault()
    
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    }

    let bodyContent = new FormData();
    bodyContent.append("name", fileRef.current.files[0].name);
    bodyContent.append("file", fileRef.current.files[0]);

    let response = await fetch("https://localhost:4000/image", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    if (response.status === 200) {
      try {
        const content = await response.json()
        await Api.addProduct(product, content)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className='addpage-container'>
      <div className='addpage'>

        <button
          className='addpage-close-btn'
          onClick={() => setAddPage(false)}>X</button>

        <form>
          <InputProduct name={'name'} title={'Nome'} call={getInfo} />
          <InputProduct name={'price'} title={'Preço'} call={getInfo} />
          <InputProduct name={'promo'} title={'Em Promoção'} call={getInfo} type='select' />
          <InputProduct name={'discount'} title={'Desconto'} call={getInfo} />
          <InputProduct name={'disponivel'} title={'Quantidade'} call={getInfo} />
          <InputProduct name={'validade'} title={'Validade'} call={getInfo} type='date' />
          <InputProduct name={'marca'} title={'Marca'} call={getInfo} />
          <InputProduct name={'peso'} title={'Peso'} call={getInfo} />
          <InputProduct name={'origem'} title={'Origem'} call={getInfo} />
          <InputProduct name={'contem'} title={'Contem Glutem'} call={getInfo} />
          <InputProduct name={'texto'} title={'Descrição'} call={getInfo} />
          <InputProduct name={'categoria'} title={'Categoria'} call={getInfo} />
          <InputProduct name={'image'} title={'Foto'} type={'file'} call={getInfo} refe={fileRef} />

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