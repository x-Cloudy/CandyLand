import { AiFillCloseCircle } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { CartContext } from '../../../context/cartContext'
import './cart.css'

export default function Cart({ setCartOpen }) {
  const { cartItem, removeItemCart } = useContext(CartContext)
  const [soma, setSoma] = useState(0)

  
  let cartItemSoma = cartItem.map((el) => el.price).reduce((max, cur) => {
   return max + cur
  }, soma)
  console.log(cartItemSoma)


  return (
    <div className='cart-container'>
      <div className='cart-header'>
        <h3>SEUS PRODUTOS</h3>
        <button onClick={() => setCartOpen(false)}><AiFillCloseCircle /></button>
      </div>

      <ul className="cart-items">
        {cartItem.map((item) => {
          return (
            <li key={item.id}>
              <div className="top-cart">
                <img src={item.img} alt={item.name} />
                <div>
                  <p className="cart-name">{`${item.name} ${item.desc.peso} - Importado ${item.desc.origem} - Marca ${item.desc.marca}`}</p>
                  <p className="cart-item-ref">Ref: CL{item.id}</p>
                </div>
              </div>

              <div className="bottom-cart">

                <div className="cart-btns">
                  <button className="cart-exclude" onClick={() => removeItemCart(item.id)}><FaTrashAlt /></button>

                  <div className="add-item-cart">
                    <button>-</button>
                    <p>{item.quantidade}</p>
                    <button>+</button>
                  </div>
                </div>

                <div className="cart-price">
                  <p>R$ {(item.price).toFixed(2)}</p>
                </div>
              </div>

            </li>
          )
        })}
      </ul>

      <div className="cart-checkout">
        <h4>Resumo</h4>
        <div className="checkout-item">
          <p>Subtotal</p>
          <p>R$ {cartItemSoma}</p>
        </div>

      </div>
    </div>
  )
}