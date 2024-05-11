import Api from '../../utils/request'
import './produtos.css'
import { useEffect, useState } from 'react'

export default function Produtos() {
  const [currentItem, setCurrentItem] = useState()

  useEffect(() => {
    const search = location.pathname.split('/').at(-1)
    Api.get(`Products/${search}`)
    .then(response => setCurrentItem(response.data))
    .catch(e => console.log(e))
  }, [])


  function render(item) {
    return (
      <div key={item._id} className='produtos'>
        {item.image && <img src={'/' + item.image.src} alt={item.name} />}
        <div className='prod-conteiner'>
          <p className='prod-name'>{item.name}</p>
          <p className='prod-price'>R$ {(item.price).toFixed(2)}</p>
          <p className='prod-dividido'>OU ATÉ 3X DE R${(item.price / 3).toFixed(2)}</p>
          <button className='prod-button'>COMPRAR</button>

          <div className='cep'>
            <span>CALCULE O FRETE</span>
            <div>
              <input type="tel" id='cepp' name='cep' maxLength="9" />
              <input type="submit" id='calculaFrete' value="OK" />
            </div>
            <div id='valorFrete'></div>
          </div>
        </div>

        {item && <div className='produtos-descricao'>
          <h3>DESCRIÇÃO</h3>
          <p id='marca'>MARCA: {item.marca}</p>
          <p id='peso'>PESO: {item.peso}</p>
          <p id='origem'>ORIGEM: {item.origem}</p>
          <p id='contem'>CONTÉM: {item.contem}</p>

          <p>{item.texto}</p>
        </div>}
      </div>
    )
  }

  return (
    <div className='produtos-container'>
        {currentItem && render(currentItem)}
    </div>
  )
}