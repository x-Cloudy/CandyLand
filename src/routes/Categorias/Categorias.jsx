import { useState, useContext, useRef, useEffect } from 'react'
import { CartContext } from '../../context/cartContext.jsx'
import { AlertContext } from '../../context/AlertContext.jsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaHeartCircleMinus } from "react-icons/fa6";
import CircularColor from '../../assets/components/Loading/Loading.jsx';
import Api from '../../utils/request.js'
import './categorias.css'

const ItemQuantity = ({ setQuantity, quantity }) => {
  function removeItem() {
    if (quantity === 1) return
    setQuantity(quantity - 1)
  }

  return (
    <div className="item-quantity">
      <button onClick={removeItem}>-</button>
      <div className="item-quantity-display">{quantity}</div>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>
  )
}

export const ItemComponent = ({ item, addItemCart }) => {
  const [quantity, setQuantity] = useState(1);
  const id = useParams();
  const { activeAlert } = useContext(AlertContext);
  let priceWithDiscount
  if (item.promo) {
    priceWithDiscount = (item.price - ((item.price * item.discount) / 100)).toFixed(2);
  }

  const ItemDisponivel = () => {
    return (
      <div>
        <div className="item-discount-box">
          {item.promo && <p className="item-discount">R${(item.price).toFixed(2)}</p>}
        </div>
        <h5 className="item-price">R${priceWithDiscount ?? item.price}</h5>
      </div>
    )
  }

  const IndisponivelItem = () => {
    return (
      <p className="indisponivel-item">ITEM INDISPONÍVEL</p>
    )
  }

  const removeFromFavoritos = (id) => {
    Api.removeFavoritos(id)
      .then((response) => {
        if (response.status === 200) {
          activeAlert(response.data)
          location.reload();
        }
      }).catch((err) => {
        console.log("Ocorreu um erro ao remover favoritos!")
      })
  }

  return (
    <div key={item._id} className="categorias-item">
      {id.categoriaId === "Favoritos" && <button className='categorias-remove-favorite' onClick={() => removeFromFavoritos(item._id)}><FaHeartCircleMinus /></button>}
      <Link to={`/Produtos/${item._id}`} className="products-link">
        {item.promo && item.disponivel > 0 && <div className="categorias-discount-num">{item.discount}%</div>}
        <div className='categorias-img'>
          <img src={item.image.src} alt={item.name} className='categorias-item-img' />
        </div>
        <p className="item-name">{item.name}</p>
        {item.disponivel > 0 ? <ItemDisponivel /> : <IndisponivelItem />}
      </Link>
      {item.disponivel > 0 &&
        <div className="products-btn-area">
          <ItemQuantity setQuantity={setQuantity} quantity={quantity} />
          <button className="categorias-comprar" onClick={() => addItemCart(item, quantity)}>
            COMPRAR
          </button>
        </div>}
    </div>
  )

}

export default function Categorias() {
  const { addItemCart } = useContext(CartContext);
  const navigate = useNavigate()
  const [data, setData] = useState()
  const [jwt, setJwt] = useState(false)
  const scrollRef = useRef(null);
  const id = useParams()
  const dataPage = [];

  useEffect(() => {
    Api.verify().then((result) => {
      setJwt(prev => prev = result)
    }).catch((err) => { })
  }, [])

  if (id.categoriaId === "Promos") {
    useEffect(() => {
      Api.getPromos()
        .then(response => {
          setData(response.data)
        })
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
    }, [id.categoriaId])
  } else if (id.categoriaId === "Favoritos") {
    useEffect(() => {
      (async () => {
        try {
          if (await Api.verify()) {
            Api.loadUserData()
              .then(response => {
                setData(prev => prev = response.data.user.favoritos)
              })
              .catch((err) => console.log('não autorizado'))
          } else {
            setData(prev => prev = '')
          }
        } catch (error) {
          setData(prev => prev = '')
        }

      })()
    }, [id.categoriaId])
  } else if (id.categoriaId === "Novidades") {
    useEffect(() => {
      Api.searchNewProducts()
        .then(response => {
          setData(response.data)
        })
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
    }, [id.categoriaId])
  } else {
    useEffect(() => {
      Api.searchCategoria(id.categoriaId)
        .then(response => {
          setData(response.data)
        })
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
    }, [id.categoriaId])
  }



  if (data) {
    const nData = data.slice()
    const integer = Math.ceil(data.length / 12);
    for (let i = 0; i < integer; i++) {
      let d = nData.splice(0, 12)
      dataPage.push(d)
    }
  }

  return (
    <>
      {data ? <div className='categorias-container'>
        <span className='scrollAnch' ref={scrollRef}></span>
        <div className='categorias-titulo'>{id.categoriaId}</div>

        {/* LISTA DE ITEMS*/}
        <div className='categorias-container-grid'>
          {dataPage.length > 0 ? dataPage[Number(id.pageId) - 1].map((item) => {
            return <ItemComponent key={item._id} item={item} addItemCart={addItemCart} />
          }) :
            <div style={{ height: `${id.categoriaId !== "Favoritos" ? "500px" : "0px"}`, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#ee688d", fontSize: "20px", fontWeight: "bold" }}>
              {id.categoriaId !== "Favoritos" && <>
                <p style={{ marginBottom: "20px" }}>＞﹏＜</p>
                <p>Nenhum produto encontrado!</p>
              </>}
            </div>
          }
        </div>

        {id.categoriaId === "Favoritos" && data && data.length < 1 &&
          <div className='unloged-fovorite-conteiner'>
            <h3 style={{ color: '#EE688D', marginBottom: "10px" }}>{"༼ つ ◕_◕ ༽つ"}</h3>
            <h3 style={{ color: '#EE688D' }}>Você ainda não tem nenhum favorito!</h3>
            <button onClick={() => navigate('/')}>Adicione alguns</button>
          </div>}

        {/* Renderizado caso o usuario não estejá logado*/}
        {id.categoriaId === "Favoritos" && !jwt &&
          <div className='unloged-fovorite-conteiner'>
            <h3 style={{ color: '#EE688D', marginBottom: "10px" }}>{"`(*>﹏<*)′"}</h3>
            <h3 style={{ color: '#EE688D' }}>Você precisa estar logado para acessar seus favoritos!</h3>
            <button onClick={() => navigate('/Login')}>Logar</button>
            <div style={{ display: "flex" }}>
              <p>Ainda não tem uma conta? </p> <Link to={'/Cadastro'} style={{ color: "#737373" }}> registrar</Link>
            </div>
          </div>}

        <div className='item-length'>
          {dataPage.map((item, index) => {
            let bGcolor, fontColor;
            if (index + 1 === Number(id.pageId)) {
              bGcolor = '#73CAC4'
              fontColor = 'white'
            } else {
              bGcolor = 'white';
              fontColor = '#737373'
            }

            const style = {
              backgroundColor: bGcolor,
              color: fontColor
            }

            return (
              <Link to={`/Categorias/${id.categoriaId}/${index + 1}`} key={index} className='item-length-link' style={style} onClick={() => {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
              }}>
                {index + 1}
              </Link>
            )
          })}
        </div>
      </div> : <div className='loading-products' style={{ marginTop: '400px', marginBlock: '200px' }}>{id.categoriaId === "Favoritos" && !jwt ? <div className='unloged-fovorite-conteiner'>
        <h3 style={{ color: '#EE688D', marginBottom: "10px" }}>{"`(*>﹏<*)′"}</h3>
        <h3 style={{ color: '#EE688D' }}>Você precisa estar logado para acessar seus favoritos!</h3>
        <button onClick={() => navigate('/Login')}>Logar</button>
        <div style={{ display: "flex" }}>
          <p>Ainda não tem uma conta? </p> <Link to={'/Cadastro'} style={{ color: "#737373" }}> registrar</Link>
        </div>
      </div> : <CircularColor />}</div>}
    </>

  )
}

