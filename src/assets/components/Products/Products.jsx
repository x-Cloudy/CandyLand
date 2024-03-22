import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './products.css'
import { useState } from "react";


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

            return (
              <div key={item.id} className="products-item">
                <img src={item.img} alt={item.name} />
                <p className="item-name">{item.name}</p>
                <div className="item-discount-box">
                  {item.promo && <p className="item-discount">R${item.price}</p>}
                </div>
                <h5 className="item-price">R${priceWithDiscount ?? item.price}</h5>
                <ItemQuantity quantity={quantity} setQuantity={setQuantity} />
                <button className="item-comprar">COMPRAR</button>
              </div>
            )
          })}
        </Slider>
      </div>

    </div>
  )
}