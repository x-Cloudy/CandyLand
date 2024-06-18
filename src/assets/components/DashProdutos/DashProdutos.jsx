import { useEffect, useRef, useState } from 'react'
import Api from '../../../utils/request'
import { useNavigate } from 'react-router-dom'
import './dashProdutos.css'

//RETIRAR A URL DE LOCALHOST

async function itemDelete(data) {
  await Api.delete(data._id, data.image._id, data.image.src)
}

export function DashAllProdutos({ data, edit, filters = []}) {
  let filterData;
  if (data && filters.length > 0) {
    filterData = data.filter((item) => {
      for (let filter of filters) {
        if (item.categoria.toLowerCase() === filter) {
          return item
        } else if (item.promo && filter === 'promocao') {
          return item
        } else if (item.new && filter === 'novidade') {
          return item
        }
      }
    })
  } else {
    filterData = data;
  }

  return (
    <div className='dash-all-produtos'>
      <ul>
        {data && filterData.map((data) => {
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
                <p>Validade: {new Date(data.validade).toLocaleString('pt-BR', { timeZone: 'UTC' }).slice('0', '10')}</p>
              </div>

              <div className='dash-all-button-container'>
                <button className='dash-all-button'
                  onClick={() => edit({
                    active: true,
                    data: data
                  })}>Edit</button>
                <button className='dash-all-button' onClick={() => itemDelete(data)}>X</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DashController({ setAddPage, setFilters }) {

  const AddButton = ({ title }) => {
    return (
      <button className='add-produtos'
        onClick={() => setAddPage(true)}>
        {title}
      </button>
    )
  }

  function DashFilter() {

    const DashFilterInput = ({ id, name }) => {
      return (
        <div className='dash-filter-input'>
          <input type="checkbox" name={id} id={id} />
          <label htmlFor={id}>{name}</label>
        </div>
      )
    }

    const applyFilters = (e) => {
      e.preventDefault();
      const filters = [];
      let hasFilter = false;
      for (let input of e.target) {
        if (input.checked) {
          filters.push(input.name);
          hasFilter = true;
        }
      }
      if (hasFilter) {
        setFilters((prev) => prev = filters)
      }
    }

    return (
      <div className='dash-produtos-filter'>
        <form name='filter' id='filter' onSubmit={applyFilters}>
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
          <button type='button' onClick={() => setFilters([])} >Remover filtros</button>
        </form>
      </div>
    )
  }

  return (
    <div className='dash-controller-produtos'>
      <AddButton title={'Adicionar Produto'} />
      <DashFilter />
    </div>
  )
}

function InputProduct({ name, title, call, type = 'text', refe, placeholder }) {
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
            placeholder={placeholder}
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
  const navigate = useNavigate()
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
    new: false
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

    let bodyContent = new FormData();
    bodyContent.append("name", fileRef.current.files[0].name);
    bodyContent.append("file", fileRef.current.files[0]);

    let response = await Api.addImage(bodyContent);
    if (response.status === 200) {
      try {
        await Api.addProduct(product, response.data);
        location.reload();
      } catch (error) {
        console.log("Ocorreu um erro ao carregar!");
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
          <InputProduct name={'contem'} title={'Contem Glutem'} call={getInfo} type='select' />
          <InputProduct name={'texto'} title={'Descrição'} call={getInfo} />
          <div>
            <label htmlFor={'categoria'}>Categoria</label>
            <select
              type={'select'}
              name={'categoria'}
              id={'categoria'}
              onChange={getInfo}
              className='addpage-input'
            >
              <option value="">Selecione</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Biscoito">Biscoito</option>
              <option value="Bala">Bala</option>
              <option value="Bebidas">Bebida</option>
              <option value="Conveniencia">Conveniência</option>
              <option value="Snacks">Snacks</option>
              <option value="Coreanos">Coreanos</option>
            </select>
          </div>
          <InputProduct name={'new'} title={'Novidade'} call={getInfo} type='select' />
          <InputProduct name={'image'} title={'Foto'} type={'file'} call={getInfo} refe={fileRef} />

          <button onClick={sendToApi}>ADICIONAR</button>
        </form>
      </div>
    </div>
  )
}

export function EditPage({ props }) {
  const { editPage, setEditPage } = props;
  const [product, setProduct] = useState({
    _id: '',
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
    image: '',
    new: false
  });
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setProduct(prev => prev = editPage.data)
  }, [])

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


  function saveProduct(e) {
    e.preventDefault();

    setProduct((prev) => ({
      ...prev,
      image: editPage.data.image._id
    }))

    setSaved(prev => prev = true)
  }

  async function attProduct(e) {
    e.preventDefault();

    setSaved(false)
    const response = await Api.attProduct(editPage.data._id, product);
    if (response.status == 200) {
      location.reload();
    }
  }

  return (
    <div className='addpage-container'>
      <div className='addpage'>

        <button className='addpage-close-btn'
          onClick={() => setEditPage({
            ...editPage,
            active: false
          })}>X</button>

        {editPage && <form>
          <InputProduct name={'name'} title={'Nome'} call={getInfo} placeholder={editPage.data.name} />
          <InputProduct name={'price'} title={'Preço'} call={getInfo} placeholder={editPage.data.price} />
          <InputProduct name={'promo'} title={'Em Promoção'} call={getInfo} type='select' />
          <InputProduct name={'discount'} title={'Desconto'} call={getInfo} placeholder={editPage.data.discount} />
          <InputProduct name={'disponivel'} title={'Quantidade'} call={getInfo} placeholder={editPage.data.disponivel} />
          <InputProduct name={'validade'} title={'Validade'} call={getInfo} type='date' />
          <InputProduct name={'marca'} title={'Marca'} call={getInfo} placeholder={editPage.data.marca} />
          <InputProduct name={'peso'} title={'Peso'} call={getInfo} placeholder={editPage.data.peso} />
          <InputProduct name={'origem'} title={'Origem'} call={getInfo} placeholder={editPage.data.origem} />
          <InputProduct name={'contem'} title={'Contem Glutem'} call={getInfo} type='select' />
          <InputProduct name={'texto'} title={'Descrição'} call={getInfo} placeholder={editPage.data.texto} />
          <div>
            <label htmlFor={'categoria'}>Categoria</label>
            <select
              type={'select'}
              name={'categoria'}
              id={'categoria'}
              onChange={getInfo}
              className='addpage-input'
            >
              <option value="">Selecione</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Biscoito">Biscoito</option>
              <option value="Bala">Bala</option>
              <option value="Bebidas">Bebida</option>
              <option value="Conveniencia">Conveniência</option>
              <option value="Snacks">Snacks</option>
              <option value="Coreanos">Coreanos</option>
            </select>
          </div>
          <InputProduct name={'new'} title={'Novidade'} call={getInfo} type='select' />
          <div>
            <button onClick={saveProduct} className='edit-product-save-btn'>Salvar</button>
            <button onClick={attProduct} disabled={saved ? false : true}
              className='edit-product-send-btn'
            >ATUALIZAR</button>
          </div>
        </form>}

      </div>
    </div>
  )
}

export default function DashProdutos() {
  const [data, setData] = useState()
  const [addPage, setAddPage] = useState(false)
  const [filters, setFilters] = useState([])
  const [editPage, setEditPage] = useState({
    active: false,
    data: null
  })

  useEffect(() => {
    Api.get("products")
      .then(response => setData(response.data))
      .catch(err => console.log("Ocorreu um erro ao carregar!"))
  }, [])

  return (
    <div className='dash-produtos-container'>
      <h5>Todos os produtos</h5>
      <ul className='filters-row'>
        {filters && filters.map((item, index) => {
          return (
            <li key={index}>{item === 'promocao' ? "Promoção" : item}</li>
          )
        })}
      </ul>

      <div className='dash-produtos'>
        <DashAllProdutos data={data} edit={setEditPage} filters={filters} />
        <DashController setAddPage={setAddPage} setFilters={setFilters} />
      </div>
      {addPage && <AddPage setAddPage={setAddPage} />}
      {editPage.active && <EditPage props={{ editPage, setEditPage }} />}
    </div>
  )
}