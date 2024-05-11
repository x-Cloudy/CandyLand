import { AiFillCloseCircle } from "react-icons/ai";
import { BsCartX } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import { CartContext } from '../../../context/cartContext'
import { Link } from "react-router-dom";
import './cart.css'

export default function Cart({ setCartOpen }) {
  const { cartItem, removeItemCart } = useContext(CartContext)
  const [changes, setChanges] = useState(0)

  let cartItemSoma = cartItem.map((el) => [el.price, el.quantidade, el.promo, el.discount])
    .reduce((max, cur) => {
      let discount = 0
      if (cur[2]) {
        discount = (cur[0] * cur[3]) / 100
      }

      return (max + cur[0] * cur[1]) - discount * cur[1];
    }, 0)

  let cartItemQuantidade = cartItem.map((el) => el.quantidade).reduce((max, cur) => {
    return max + cur;
  }, 0)

  const CartCheckout = () => {
    return (
      <div className="cart-checkout">
        <h4>Resumo</h4>
        <div className="checkout-item">
          <p>Subtotal</p>
          <p>R$ {(cartItemSoma).toFixed(2)}</p>
        </div>
        <div className="checkout-item">
          <p>Items</p>
          <p>{cartItemQuantidade}</p>
        </div>
        <div className="checkout-item">
          <p>Frete</p>
          <p>Calcular</p>
        </div>
        <div className="checkout-item">
          <p> <strong>Total</strong> </p>
          <div className="checkout-total-container">
            <p className="checkout-total">R$ {(cartItemSoma).toFixed(2)}</p>
            <p className="checkout-parcela">ou 3x R$ {(cartItemSoma / 3).toFixed(2)} sem juros</p>
          </div>
        </div>

        <div className="checkout-item">
          <div className="btn-check">
            <button className="checkout-button-final">Finalizar Compra</button>
            <Link className="btn-check-back" onClick={() => setCartOpen(false)}>Continuar Comprando</Link>
          </div>
        </div>

      </div>
    )
  }

  const CartEmpty = () => {
    return (
      <div className="checkout-cart-empty">
        <p className="checkout-empty-icon"><BsCartX /></p>
        <h5>Seu carrinho está vazio.</h5>
        <p className="checkout-empty-text">Navegue por nossos produtos e escolha alguma delícia</p>

        <Link to={'/'} className="empty-cart-button">Comprar</Link>
      </div>
    )
  }

  return (
    <div className='cart-container'>
      <div className='cart-header'>
        <h3>SEUS PRODUTOS</h3>
        <button onClick={() => setCartOpen(false)}><AiFillCloseCircle /></button>
      </div>

      <ul className="cart-items">
        {cartItem.map((item) => {

          function handleChangeCart(value) {
            if (item.quantidade <= 1 && value === -1) {
              return
            }

            item.quantidade = item.quantidade + value;
            setChanges(changes + 1)
          }

          return (
            <li key={item._id}>
              <div className="top-cart">
                <img src={"/" + item.image.src} alt={item.name} />
                <div>
                  <p className="cart-name">{`${item.name} ${item.peso} - Importado ${item.origem} - Marca ${item.marca}`}</p>
                  <p className="cart-item-ref">Ref: CL{item._id}</p>
                </div>
              </div>

              <div className="bottom-cart">

                <div className="cart-btns">
                  <button className="cart-exclude" onClick={() => removeItemCart(item._id)}><FaTrashAlt /></button>

                  <div className="add-item-cart">
                    <button onClick={() => handleChangeCart(-1)}>-</button>
                    <p>{item.quantidade}</p>
                    <button onClick={() => handleChangeCart(+1)}>+</button>
                  </div>
                </div>

                <div className="cart-price">
                  {item.promo && <p className="original-price">R$ {item.price}</p>}
                  <p className="discount-price">R$ {item.promo ? ((item.price - (item.price * item.discount) / 100) * item.quantidade).toFixed(2) : (item.price * item.quantidade).toFixed(2)}</p>
                </div>
              </div>

            </li>
          )
        })}
      </ul>

      {cartItemQuantidade > 0 ? <CartCheckout /> : <CartEmpty />}
    </div>
  )
}