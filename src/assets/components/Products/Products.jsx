import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './products.css'
import { useState, useContext } from "react";
import { CartContext } from "../../../context/cartContext";
import { Link } from "react-router-dom";

const ItemQuantity = ({ quantity, setQuantity }) => {
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

export default function Products({ title, data }) {
  const { cartItem, addItemCart } = useContext(CartContext)
  let SliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 3000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        }
      },
    ],
  }

  return (
    <div className='products-container'>
      <div className='products-title'>
        <div className='title-row'></div>
        <h3>{title}</h3>
        <div className='title-row'></div>
      </div>

      <div className='products'>
        <Slider {...SliderSettings}>
          {data && data.map((item) => {

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
              <div key={item._id} className="products-item">
                <Link to={`Produtos/${item.id}`} className="products-link">
                  {item.promo && item.disponivel > 0 && <div className="item-discount-num">{item.discount}%</div>}
                  <img src={item.img} alt={item.name} />
                  <p className="item-name">{item.name}</p>
                  {item.disponivel > 0 ? <ItemDisponivel /> : <IndisponivelItem />}
                </Link>
                {item.disponivel > 0 && 
                <div className="products-btn-area">
                  <ItemQuantity quantity={quantity} setQuantity={setQuantity} />
                  <button className="item-comprar" onClick={() => addItemCart(item, quantity)}>COMPRAR</button>
                  </div>}
                  
                  </div>
                  )
                })}
        </Slider>
      </div>

    </div>
  )
}