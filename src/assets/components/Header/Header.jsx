import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoMdMenu, IoMdCart, IoMdHeart, IoIosCloseCircle } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { LuBadgePercent } from "react-icons/lu";
import candyLogo from '/home/xcloudy/Projetos/pity/CandyLand/src/assets/images/candylogo.png'
import Cart from '../Cart/Cart';
import './header.css'

const MenuButton = ({ onHandleClick }) => {
  return (
    <button className='menu-button' onClick={onHandleClick}><IoMdMenu /></button>
  )
}
//CART
const CartButton = ({ handleClick }) => {
  return (
    <button className='cart-button' onClick={handleClick}><IoMdCart /></button>
  )
}

//PERFIL
const BottomMenuButton = ({ icon, link }) => {
  return (
    <Link to={link} className="bottom-menu-btn">{icon}</Link>
  )
}

const MenuTable = ({ onHandleClick }) => {
  return (
    <div className='menu-table-container'>
      <div className='menu-table'>
        <div className='menu-table-header'>
          <h3>Categorias</h3>
          <button onClick={onHandleClick}><IoIosCloseCircle /></button>
        </div>

        <ul>
          <li>
            <a href="#">
              <p>CHOCOLATE</p>

              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/chocolate.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>BISCOITO</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/biscoito.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>BALA</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/bala.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>BEBIDA</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/bebidas.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>CONVENIÊNCIA</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/conveniencia.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>SNACKS</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/snaks.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>COREANOS</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/linha-fit.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>NOVIDADES</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/novidades.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <p>PROMOÇÔES</p>
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/promocoes.svg" alt="" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

const HeaderMobile = ({ menu, cart }) => {
  const [scrollY, setScrollY] = useState(0)
  const {cartOpen, setCartOpen} = cart;
  const {menuOpen, setMenuOpen} = menu;
  let scrolled;

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollY(prev => prev = window.scrollY)
    })

    return () => {
      window.removeEventListener('scroll', () => {
        setScrollY(prev => prev = window.scrollY)
      })
    }
  }, [])


  scrollY === 0 ? scrolled = '130px' : scrolled = '40px';

  return (
    <header style={{ height: scrolled }} className='mobile-header'>
      <div className='top-header'>
        <MenuButton onHandleClick={() => setMenuOpen(true)} />
        
        <Link to={'/CandyLand'}>
          <img src={candyLogo} alt="logo candy land" />
        </Link>
                  
          <CartButton handleClick={() => setCartOpen(true)}/> 
      </div>

      <div className="bottom-header">
        <BottomMenuButton icon={<MdAccountCircle />} link={'Login'} />
        <div className="search-div">
          <div className="search-icon">
            <IoSearchSharp />
          </div>
          <input type="text" className="seach-bar" name="pesquisa" placeholder="" />
        </div>
        <BottomMenuButton icon={<IoMdHeart />} />
        <BottomMenuButton icon={<LuBadgePercent />} />
      </div>

      {menuOpen && <MenuTable onHandleClick={() => setMenuOpen(false)} />}
      {cartOpen && <Cart setCartOpen={setCartOpen}/>}
    </header>
  )
}

const HeaderDesktop = ({ menuOpen, setMenuOpen }) => {

  const DeskMenuButton = ({ icon, name, handleClick }) => {
    return <button onClick={handleClick} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span></button>
  }

  return (
    <header className='desk-header-container'>
      <div className='top-desk-header'></div>

      <div className='desk-menus'>
        <div className='desk-menu-left'>
          <DeskMenuButton icon={<IoMdMenu />} name={'Menu'} handleClick={() => setMenuOpen(true)} />
          {/*SEARCH BAR*/}
          <div className="search-div-desk">
            <div className="search-icon-desk">
              <IoSearchSharp />
            </div>
            <input type="text" className="seach-bar-desk" name="pesquisa" placeholder="" />
          </div>
        </div>
        <img src={candyLogo} alt="main logo" className='desk-img-logo' />

        <div className='desk-menu-rigth'>
          <Link to={'/CandyLand/Login'} id='menu-btn-decoRemove'>
            <DeskMenuButton icon={<MdAccountCircle />} name={'Minha Conta'} />
          </Link>
          <DeskMenuButton icon={<IoMdHeart />} name={'Favoritos'} />
          <DeskMenuButton icon={<LuBadgePercent />} name={'Promoções'} />
          <DeskMenuButton icon={<IoMdCart />} name={'Meu Carrinho'} />
        </div>
      </div>
      {menuOpen && <MenuTable onHandleClick={() => setMenuOpen(false)} />}
    </header>
  )
}

export default function Header() {
  const [isMobile, setIsMobile] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    let windowSize = window.innerWidth
    if (windowSize > 1000) {
      setIsMobile(prev => prev = false)
    }
  }, [])

  return (
    <>
      {isMobile ? <HeaderMobile menu={{menuOpen, setMenuOpen}} cart={{cartOpen, setCartOpen}} />
        : <HeaderDesktop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
    </>
  )
}