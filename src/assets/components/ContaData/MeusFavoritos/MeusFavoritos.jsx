import { useContext } from 'react'
import { CartContext } from '../../../../context/cartContext'
import { ItemComponent } from '../../../../routes/Categorias/Categorias'
import './meusFavoritos.css'

export default function MeusFavoritos({ data }) {
  const favoritos = data.favoritos
  const { addItemCart } = useContext(CartContext)

  return (
  <div className='meus-favoritos-container'>
    {favoritos.map((item) => {
      return <ItemComponent key={item.id} item={item} addItemCart={addItemCart} />
    })}
  </div>)
}