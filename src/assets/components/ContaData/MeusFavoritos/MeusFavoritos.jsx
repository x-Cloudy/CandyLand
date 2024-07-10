import { useContext } from 'react'
import { CartContext } from '../../../../context/cartContext'
import { ItemComponent } from '../../../../routes/Categorias/Categorias'
import CircularColor from '../../Loading/Loading'
import './meusFavoritos.css'

export default function MeusFavoritos({ data }) {
  if (!data) return (
    <div className='loading-meus-dados'><CircularColor /></div>
  )
  const favoritos = data.favoritos
  const { addItemCart } = useContext(CartContext)

  return (
    <div className='meus-favoritos-container'>
      {favoritos.length < 1 ? <div style={{ height: "500px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#ee688d", fontSize: "20px", fontWeight: "bold" }}>
        <p style={{marginBottom: "20px"}}>༼ つ ◕_◕ ༽つ</p>
        <p>Você ainda não tem favoritos!</p>
      </div> : favoritos.map((item) => {
        return <ItemComponent key={item._id} item={item} addItemCart={addItemCart} />
      })}
    </div>)
}