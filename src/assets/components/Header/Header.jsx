import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoMdMenu, IoMdCart, IoMdHeart } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { LuBadgePercent } from "react-icons/lu";
import candyLogo from '/home/xcloudy/Projetos/pity/CandyLand/src/assets/images/candylogo.png'
import Cart from '../Cart/Cart';
import MenuTable from './MenuTable';
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

const HeaderMobile = ({ menu, cart }) => {
  const [scrollY, setScrollY] = useState(0)
  const { cartOpen, setCartOpen } = cart;
  const { menuOpen, setMenuOpen } = menu;
  let scrolled;
  let isLogged = true;

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

        <CartButton handleClick={() => setCartOpen(true)} />
      </div>

      <div className="bottom-header">
        <BottomMenuButton icon={<MdAccountCircle />} link={isLogged ? 'MinhaConta' : 'Login'} />
        <div className="search-div">
          <div className="search-icon">
            <IoSearchSharp />
          </div>
          <input type="text" className="seach-bar" name="pesquisa" placeholder="" />
        </div>
        <BottomMenuButton icon={<IoMdHeart />} link={'Categorias/Favoritos/1'} />
        <BottomMenuButton icon={<LuBadgePercent />} link={'Categorias/Promoções/1'} />
      </div>

      {menuOpen && <MenuTable props={{ setMenuOpen }} />}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </header>
  )
}

const HeaderDesktop = ({ menu, cart }) => {
  const { cartOpen, setCartOpen } = cart;
  const { menuOpen, setMenuOpen } = menu;

  const DeskMenuButton = ({ icon, name, handleClick }) => {
    return <button onClick={handleClick} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span></button>
  }

  const DeskLinkButton = ({ link, icon, name }) => {
    return (<Link to={link} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span>
    </Link>)
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
            <DeskLinkButton icon={<MdAccountCircle />} name={'Minha Conta'} link={'Login'} />
          </Link>
          <DeskMenuButton icon={<IoMdHeart />} name={'Favoritos'} />
          <DeskMenuButton icon={<LuBadgePercent />} name={'Promoções'} />
          <DeskMenuButton icon={<IoMdCart />} name={'Meu Carrinho'} handleClick={() => setCartOpen(true)} />
        </div>
      </div>
      {menuOpen && <MenuTable props={{ setMenuOpen }} />}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </header>
  )
}

export default function Header() {
  const [isMobile, setIsMobile] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  //SetMobile
  useEffect(() => {
    let windowSize = window.innerWidth
    if (windowSize > 1000) {
      setIsMobile(prev => prev = false)
    }
  }, [])

  return (
    <>
      {isMobile ? <HeaderMobile menu={{ menuOpen, setMenuOpen }} cart={{ cartOpen, setCartOpen }} />
        : <HeaderDesktop menu={{ menuOpen, setMenuOpen }} cart={{ cartOpen, setCartOpen }} />}
    </>
  )
}