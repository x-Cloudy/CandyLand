import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdMenu, IoMdCart, IoMdHeart } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { LuBadgePercent } from "react-icons/lu";
import candyLogo from '../../images/candylogo.png'
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

const HeaderContainer = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)
  const [scrolled, setScrolled] = useState();


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

  useEffect(() => {
    scrollY === 0 || scrollY < 10 ? setScrolled(prev => prev = '130px') : setScrolled(prev => prev = '40px');
  }, [scrollY])



  return (
    <header style={{ height: scrolled }} className='mobile-header'>
      {children}
    </header>
  )
}

const HeaderMobile = ({ menu, cart, searchFuncs }) => {

  const { cartOpen, setCartOpen } = cart;
  const { menuOpen, setMenuOpen } = menu;
  const { setSearch, getSearch } = searchFuncs;



  function handleInput(e) {
    setSearch(prev => prev = e.target.value)
  }

  return (
    <HeaderContainer>
      <div className='top-header'>
        <MenuButton onHandleClick={() => setMenuOpen(true)} />

        <Link to={'/'}>
          <img src={candyLogo} alt="logo candy land" />
        </Link>

        <CartButton handleClick={() => setCartOpen(true)} />
      </div>

      <div className="bottom-header">
        <BottomMenuButton icon={<MdAccountCircle />} link={'/Login'} />
        <div className="search-div">
          <div className="search-icon">
            <IoSearchSharp onClick={getSearch} />
          </div>
          <input
            type="text"
            className="seach-bar"
            name="pesquisa"
            placeholder="Oque você procura?"
            onChange={handleInput}
            onKeyDown={getSearch} />
        </div>
        <BottomMenuButton icon={<IoMdHeart />} link={'Categorias/Favoritos/1'} />
        <BottomMenuButton icon={<LuBadgePercent />} link={'Categorias/Promos/1'} />
      </div>

      {menuOpen && <MenuTable props={{ setMenuOpen }} />}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </HeaderContainer>
  )
}

const HeaderDesktop = ({ menu, cart, searchFuncs }) => {
  const { cartOpen, setCartOpen } = cart;
  const { menuOpen, setMenuOpen } = menu;
  const { setSearch, getSearch } = searchFuncs;
  const navigate = useNavigate()

  const DeskMenuButton = ({ icon, name, handleClick }) => {
    return <button onClick={handleClick} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span></button>
  }

  const DeskLinkButton = ({ link, icon, name }) => {
    return (<Link to={link} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span>
    </Link>)
  }

  function handleInput(e) {
    setSearch(prev => prev = e.target.value)
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
            <input type="text"
              className="seach-bar-desk"
              name="pesquisa"
              placeholder="Oque você procura?"
              onChange={handleInput}
              onKeyDown={getSearch} />
          </div>
        </div>

        <img src={candyLogo} alt="main logo" className='desk-img-logo' onClick={() => navigate('/')} />

        <div className='desk-menu-rigth'>

          <DeskLinkButton icon={<MdAccountCircle />} name={'Minha Conta'} link={'/Login'} />
          <DeskLinkButton icon={<IoMdHeart />} name={'Favoritos'} link={'/Categorias/Favoritos/1'} />
          <DeskLinkButton icon={<LuBadgePercent />} name={'Promoções'} link={'/Categorias/Promos/1'} />
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
  const [search, setSearch] = useState('');
  const navigate = useNavigate()
  //SetMobile
  useEffect(() => {
    let windowSize = window.innerWidth
    if (windowSize > 1000) {
      setIsMobile(prev => prev = false)
    }
  }, [])

  function getSearch(e) {
    if (e.type === 'keydown' && e.key !== 'Enter') return
    navigate(`/search/${search}/1`)
  }

  return (
    <>
      {isMobile ? <HeaderMobile
        menu={{ menuOpen, setMenuOpen }}
        cart={{ cartOpen, setCartOpen }}
        searchFuncs={{ setSearch, getSearch }} />
        : <HeaderDesktop
          menu={{ menuOpen, setMenuOpen }}
          cart={{ cartOpen, setCartOpen }}
          searchFuncs={{ setSearch, getSearch }} />}
    </>
  )
}