import { useEffect, useState, useContext, useRef } from 'react'
import { CartContext } from '../../context/cartContext'
import { useParams, Link } from 'react-router-dom'
import { ItemComponent } from '../Categorias/Categorias'
import Api from '../../utils/request'
import './searchPage.css'

const NoItemsFound = () => {
  return (
    <div className='noItemsFound'>
      <h2>Nenhum item encontrado!</h2>
      <p>Tente pesquisar de uma outra forma.</p>
    </div>
  )
}

export default function SearchPage() {
  const { addItemCart } = useContext(CartContext)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const params = useParams('q')
  const dataPage = [];

  useEffect(() => {

    Api.searchInput(params.q)
      .then((result) => {
        if (result.status === 200) {
          setData(result.data);
          return
        }
        setError(result.response.data)
      })

  }, [params.q])

  if (data) {
    const nData = data.slice()
    const integer = Math.ceil(data.length / 10);
    for (let i = 0; i < integer; i++) {
      let d = nData.splice(0, 10)
      dataPage.push(d)
    }
  }

  if (data && data.length < 1) {
    return (
      <NoItemsFound />
    )
  }

  return (
    <div className='categorias-container'>
      <span className='scrollAnch' ref={scrollRef}></span>

      {/* LISTA DE ITEMS*/}
      <div className='categorias-container-grid'>
        {dataPage.length > 0 && dataPage[Number(params.pageId) - 1].map((item) => {
          return <ItemComponent key={item._id} item={item} addItemCart={addItemCart} />
        })}
      </div>

      <div className='item-length'>
        {dataPage.map((item, index) => {
          let bGcolor, fontColor;
          if (index + 1 === Number(params.pageId)) {
            bGcolor = '#73CAC4'
            fontColor = 'white'
          } else {
            bGcolor = 'white';
            fontColor = '#737373'
          }

          const style = {
            backgroundColor: bGcolor,
            color: fontColor
          }

          return (
            <Link to={`/search/${params.q}/${index + 1}`} key={index} className='item-length-link' style={style} onClick={() => {
              scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }}>
              {index + 1}
            </Link>
          )
        })}
      </div>
    </div>
  )
}