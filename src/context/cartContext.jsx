import { createContext, useState, useContext, useEffect } from "react";
import { AlertContext } from "./AlertContext";
import Api from '../utils/request.js'

export const CartContext = createContext([])

export function CartProvider({ children }) {
  const { activeAlert } = useContext(AlertContext)
  const [cartItem, setCartItem] = useState([])
  const [changes, setChanges] = useState(0)

  // Recarrega o conteudo do cart coletando info do localStorage
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

  // Adiciona items ao carrinho e salva no localStorage
  function addItemCart(item, quantidade) {
    for (let cartI of cartItem) {
      if (cartI._id === item._id) {
        activeAlert('Este item já está no seu carrinho')
        return
      }
    }
    activeAlert('Item adicionado ao carrinho!')
    const cartPrev = localStorage.getItem("cart");
    const items = JSON.parse(cartPrev)

    items.push([item._id, quantidade])
    localStorage.setItem("cart", JSON.stringify(items))

    setCartItem([
      ...cartItem,
      { ...item, quantidade }
    ])
  }

  // Muda a quantidade de items dentro do cart
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

  // Remove um item do cart
  function removeItemCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const filter = cart.filter(item => item[0] !== id);
    localStorage.setItem('cart', JSON.stringify(filter));
 
    setCartItem(
      cartItem.filter(item => item._id !== id)
    )
  }

  function removeAllCart() {
    localStorage.setItem("cart", "[]")
    setCartItem(prev => prev = [])
  }

  return (
    <CartContext.Provider value={{ cartItem, addItemCart, removeItemCart, changeQuantity, removeAllCart }}>
      {children}
    </CartContext.Provider>
  )
}