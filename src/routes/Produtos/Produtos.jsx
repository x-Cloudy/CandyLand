import { useLoaderData } from 'react-router-dom'
import './produtos.css'

export default function Produtos() {
  const { data } = useLoaderData()
  const item = data[0]

  function render(item) {
    return (
      <div key={item.id} className='produtos'>
        <img src={item.img} alt={item.name} />
        <div className='prod-conteiner'>
          <p className='prod-name'>{item.name}</p>
          <p className='prod-price'>R$ {(item.price).toFixed(2)}</p>
          <p className='prod-dividido'>OU ATÉ 3X DE R${(item.price / 3).toFixed(2)}</p>
          <button className='prod-button'>COMPRAR</button>

          <div className='cep'>
            <span>CALCULE O FRETE</span>
            <div>
              <input type="tel" id='cep' name='cep' maxLength="9" />
              <input type="submit" id='calculaFrete' value="OK" />
            </div>
            <div id='valorFrete'></div>
          </div>
        </div>

        {item.desc && <div className='produtos-descricao'>
          <h3>DESCRIÇÃO</h3>
          <p id='marca'>MARCA: {item.desc.marca}</p>
          <p id='peso'>PESO: {item.desc.peso}</p>
          <p id='origem'>ORIGEM: {item.desc.origem}</p>
          <p id='contem'>CONTÉM: {item.desc.contem}</p>

          <p>{item.desc.texto}</p>
        </div>}
      </div>
    )
  }

  return (
    <div className='produtos-container'>
      {render(item)}
    </div>
  )
}