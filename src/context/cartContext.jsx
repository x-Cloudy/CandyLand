import { createContext, useState, useContext } from "react";
import { AlertContext } from "./AlertContext";

export const CartContext = createContext([])

export function CartProvider({children}) {
  const { activeAlert } = useContext(AlertContext)
  const [cartItem, setCartItem] = useState([])
  
  function addItemCart(item, quantidade) {
    for (let cartI of cartItem) {
      if (cartI._id === item._id) {
        activeAlert('Este item já está no seu carrinho')
        return
      }
    }
    setCartItem([
      ...cartItem,
      {...item, quantidade}
    ])
  }

  function removeItemCart(id) {
    setCartItem(
      cartItem.filter(item => item._id !== id )
    )
  }


  return (
    <CartContext.Provider value={{cartItem, addItemCart, removeItemCart}}>
      {children}
    </CartContext.Provider>
  )
}