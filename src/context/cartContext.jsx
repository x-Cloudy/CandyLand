import { createContext, useState } from "react";

export const CartContext = createContext([])

export function CartProvider({children}) {
  const [cartItem, setCartItem] = useState([])
  
  function addItemCart(item, quantidade) {
    for (let cartI of cartItem) {
      if (cartI.id === item.id) {
        alert('Este item já está no seu carrinho')
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