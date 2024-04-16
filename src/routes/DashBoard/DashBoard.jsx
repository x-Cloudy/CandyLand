import { IoReturnDownBack, IoPeopleOutline } from "react-icons/io5";
import { PiHouseSimple, PiShoppingCart, PiNewspaper } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { Link, Outlet, useNavigate } from 'react-router-dom'
import CandyLogo from '../../assets/images/candylogo.png'
import { useState } from "react";
import './dashBoard.css'

const DashTitle = () => {
  return (
    <div className='dash-title'>
      <img src={CandyLogo} alt="logo da marca" />
      <p>Candy Land</p>
      <Link to={'/CandyLand'} className='dash-back-button'><IoReturnDownBack /></Link>
    </div>
  )
}

function DashNav({ page }) {
  const { currentPage, setPage } = page;
  const navigate = useNavigate()

  const DashBtn = ({ name, icon, url }) => {
    return (
      <button className={currentPage === name ? 'dash-btn-active' : 'dash-btn'}
        onClick={() => {
          setPage(name)
          navigate(url)
        }}>
        <p className='dash-btn-icon'>{icon}</p>
        <p className='dash-btn-name'>{name}</p>
      </button>
    )
  }

  return (
    <div className='dash-nav'>
      <DashBtn name={'Visão Geral'} icon={<PiHouseSimple />} url={'/CandyLand/DashBoard'} />
      <DashBtn name={'Produtos'} icon={<PiShoppingCart />} url={'Produtos'} />
      <DashBtn name={'Pedidos'} icon={<PiNewspaper />} url={'Pedidos'} />
      <DashBtn name={'Clientes'} icon={<IoPeopleOutline />} url={'Clientes'} />
    </div>
  )
}

const ContentHeader = () => {
  return (
    <div className="content-header">
      <div className="content-search">
        <button><IoIosSearch /></button>
        <input type="text" placeholder="Pesquise produtos, clientes, etc..." />
      </div>

      <div className="header-perfil">
        <div className="header-perfil-img"></div>
        <div className="header-perfil-names">
          <p>Raquel Rodrigues</p>
          <p className="header-perfil-tag">Admin</p>
        </div>
      </div>
    </div>
  )
}

export default function DashBoard() {
  const [currentPage, setPage] = useState('Visão Geral')

  return (
    <div className='dashboard-container'>
      <div className='dashboard-menu'>
        <DashTitle />
        <DashNav page={{ currentPage, setPage }} />
        <div className="dash-logout">
          <button className="dash-logout-btn"><BiLogOut /> Sair</button>
        </div>
      </div>

      <div className='dashboard-content'>
        <ContentHeader />
        <Outlet />
      </div>
    </div>
  )
}