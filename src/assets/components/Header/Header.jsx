import { useEffect, useState } from 'react'
import { IoMdMenu, IoMdCart, IoMdHeart, IoIosCloseCircle } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { LuBadgePercent } from "react-icons/lu";
import candyLogo from '/home/xcloudy/Projetos/pity/CandyLand/src/assets/images/candylogo.png'
import './header.css'

const MenuButton = ({ onHandleClick }) => {
  return (
    <button className='menu-button' onClick={onHandleClick}><IoMdMenu /></button>
  )
}

const CartButton = ({ onHandleClick }) => {
  return (
    <button className='cart-button' onClick={onHandleClick}><IoMdCart /></button>
  )
}

const BottomMenuButton = ({ icon }) => {
  return (
    <button className="bottom-menu-btn">{icon}</button>
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
              CHOCOLATE
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/chocolate.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              BISCOITO
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/biscoito.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              BALA
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/bala.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              BEBIDA
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/bebidas.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              CONVENIÊNCIA
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/conveniencia.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              SNACKS
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/snaks.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              COREANOS
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/linha-fit.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              NOVIDADES
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/novidades.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              PROMOÇÔES
              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/promocoes.svg" alt="" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

const HeaderMobile = () => {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
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
        <img src={candyLogo} alt="logo candy land" />
        <CartButton />
      </div>

      <div className="bottom-header">
        <BottomMenuButton icon={<MdAccountCircle />} />
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
    </header>
  )
}

const HeaderDesktop = () => {

  const DeskMenuButton = ({ icon, name, handleClick }) => {
    return <button onClick={handleClick} className='desk-menu-btn'>
      <p>{icon}</p><span>{name}</span></button>
  }

  return (
    <header className='desk-header-container'>
      <div className='top-desk-header'></div>

      <div className='desk-menus'>
        <div className='desk-menu-left'>
          <DeskMenuButton icon={<IoMdMenu />} name={'Menu'} />
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
          <DeskMenuButton icon={<MdAccountCircle />} name={'Minha Conta'} />
          <DeskMenuButton icon={<IoMdHeart />} name={'Favoritos'} />
          <DeskMenuButton icon={<LuBadgePercent />} name={'Promoções'} />
          <DeskMenuButton icon={<IoMdCart />} name={'Meu Carrinho'} />

        </div>
      </div>

    </header>
  )
}

export default function Header() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    let windowSize = window.innerWidth
    if (windowSize > 1000) {
      setIsMobile(prev => prev = false)
    }
  }, [])

  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
    </>
  )
}