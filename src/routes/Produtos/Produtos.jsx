import Api from '../../utils/request'
import './produtos.css'
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../context/cartContext';
import CircularColor from '../../assets/components/Loading/Loading';

export default function Produtos() {
  const [currentItem, setCurrentItem] = useState();
  const [loading, setLoading] = useState(true);
  const { addItemCart } = useContext(CartContext);

  useEffect(() => {
    const search = location.pathname.split('/').at(-1)
    Api.get(`Products/${search}`)
      .then(response => {
        setCurrentItem(prev => prev = response.data);
        setLoading(prev => prev = false);
      })
      .catch(e => console.log("Ocorreu um erro ao carregar!"))
  }, [])


  function render(item) {
    return (
      <div key={item._id} className='produtos'>
        {item.image && <img src={item.image.src} alt={item.name} />}
        <div className='prod-conteiner'>
          <p className='prod-name'>{item.name}</p>
          <p className='prod-price'>R$ {(item.price).toFixed(2)}</p>
          <p className='prod-dividido'>OU ATÉ 3X DE R${(item.price / 3).toFixed(2)}</p>
          <button className='prod-button' onClick={() => addItemCart(item, 1)}>COMPRAR</button>

          {/* <div className='cep'>
            <span>CALCULE O FRETE</span>
            <div>
              <input type="tel" id='cepp' name='cep' maxLength="9" />
              <input type="submit" id='calculaFrete' value="OK" />
            </div>
            <div id='valorFrete'></div>
          </div> */}
        </div>

        {item && <div className='produtos-descricao'>
          <h3>DESCRIÇÃO</h3>
          <p id='marca'>MARCA: {item.marca}</p>
          <p id='peso'>PESO: {item.peso}</p>
          <p id='origem'>ORIGEM: {item.origem}</p>
          <p id='contem'>CONTÉM GLUTEM: {item.contem === "true" ? "Sim" : "Não"}</p>

          <p>{item.texto}</p>
        </div>}
      </div>
    )
  }

  return (
    <div className='produtos-container'>
      {loading ? <div style={{height: "500px", margin: "200px 0", display: "flex", justifyContent: "center", alignItems: "center"}}><CircularColor /></div> : render(currentItem)}
    </div>
  )
}