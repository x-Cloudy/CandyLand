import { createContext, useState, useContext, useEffect } from "react";
import { AlertContext } from "./AlertContext";
import Api from '../utils/request.js'

export const CartContext = createContext([])

export function CartProvider({ children }) {
  const { activeAlert } = useContext(AlertContext)
  const [cartItem, setCartItem] = useState([])
  const [changes, setChanges] = useState(0)

  useEffect(() => {
    (async () => {
      const teste = [];
      if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", "[]")
      }

      const cartPrev = localStorage.getItem("cart");
      const items = JSON.parse(cartPrev)

      for (let item of items) {
        const response = await Api.get(`products/${item[0]}`)
        const data = response.data;
        const quantidade = item[1]
        teste.push({ ...data, quantidade })
      }
      setCartItem(prev => prev = teste);
    })();
  }, [changes])

  function addItemCart(item, quantidade) {
    for (let cartI of cartItem) {
      if (cartI._id === item._id) {
        activeAlert('Este item já está no seu carrinho')
        return
      }
    }
    const cartPrev = localStorage.getItem("cart");
    const items = JSON.parse(cartPrev)

    items.push([item._id, quantidade])
    localStorage.setItem("cart", JSON.stringify(items))

    setCartItem([
      ...cartItem,
      { ...item, quantidade }
    ])
  }

  function changeQuantity(id, num) {
    const cartPrev = localStorage.getItem("cart");
    const items = JSON.parse(cartPrev)

    for (let item of items) {
      if (item[0] === id) {
        item[1] = item[1] + num
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(items))
    setChanges(changes + 1)
  }

  function removeItemCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const filter = cart.filter(item => item[0] !== id);
    localStorage.setItem('cart', JSON.stringify(filter));
 
    setCartItem(
      cartItem.filter(item => item._id !== id)
    )
  }


  return (
    <CartContext.Provider value={{ cartItem, addItemCart, removeItemCart, changeQuantity }}>
      {children}
    </CartContext.Provider>
  )
}