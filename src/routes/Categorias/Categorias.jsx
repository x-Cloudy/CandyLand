import ProdutosData from '../../data/ProdutosData'
import { useLoaderData } from 'react-router-dom'
import { useState, useContext, useRef } from 'react'
import { CartContext } from '../../context/cartContext.jsx'
import { Link, useParams } from 'react-router-dom'
import './categorias.css'

const ItemQuantity = ({ setQuantity, quantity }) => {
  function removeItem() {
    if (quantity === 1) return
    setQuantity(quantity - 1)
  }

  return (
    <div className="item-quantity">
      <button onClick={removeItem}>-</button>
      <div className="item-quantity-display">{quantity}</div>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>
  )
}



const ItemComponent = ({ item, addItemCart }) => {
  const [quantity, setQuantity] = useState(1)

  let priceWithDiscount
  if (item.promo) {
    priceWithDiscount = (item.price - ((item.price * item.discount) / 100)).toFixed(2);
  }

  const ItemDisponivel = () => {
    return (
      <div>
        <div className="item-discount-box">
          {item.promo && <p className="item-discount">R${(item.price).toFixed(2)}</p>}
        </div>
        <h5 className="item-price">R${priceWithDiscount ?? item.price}</h5>
      </div>
    )
  }

  const IndisponivelItem = () => {
    return (
      <p className="indisponivel-item">ITEM INDISPONÍVEL</p>
    )
  }

  return (
    <div key={item.id} className="categorias-item">
      <Link to={`/CandyLand/Produtos/${item.id}`} className="products-link">
        {item.promo && item.disponivel > 0 && <div className="categorias-discount-num">{item.discount}%</div>}
        <div className='categorias-img'>
          <img src={item.img} alt={item.name} />
        </div>
        <p className="item-name">{item.name}</p>
        {item.disponivel > 0 ? <ItemDisponivel /> : <IndisponivelItem />}
      </Link>
      {item.disponivel > 0 &&
        <div className="products-btn-area">
          <ItemQuantity setQuantity={setQuantity} quantity={quantity} />
          <button className="categorias-comprar" onClick={() => addItemCart(item, quantity)}>
            COMPRAR
          </button>
        </div>}
    </div>
  )

}


export async function getCategorias() {
  const data = await ProdutosData()
  return { data }
}

export default function Categorias() {
  const { data } = useLoaderData()
  const { addItemCart } = useContext(CartContext)
  const id = useParams()
  const nData = data.slice()
  const dataPage = [];
  const integer = Math.ceil(data.length / 10);
  const scrollRef = useRef(null);

  for (let i = 0; i < integer; i++) {
    let d = nData.splice(0, 10)
    dataPage.push(d)
  }

  return (
    <div className='categorias-container'>
      <span className='scrollAnch' ref={scrollRef}></span>
      <div className='categorias-titulo'>{id.categoriaId}</div>

      {/* LISTA DE ITEMS*/}
      <div className='categorias-container-grid'>
        {dataPage[Number(id.pageId) - 1].map((item) => {
          return <ItemComponent key={item.id} item={item} addItemCart={addItemCart} />
        })}
      </div>

      <div className='item-length'>
        {dataPage.map((item, index) => {
          let bGcolor, fontColor;
          if (index + 1 === Number(id.pageId)) {
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
            <Link to={`/CandyLand/Categorias/Chocolate/${index + 1}`} key={index} className='item-length-link' style={style} onClick={() => {
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

