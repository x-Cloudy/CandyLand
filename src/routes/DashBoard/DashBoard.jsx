import { IoReturnDownBack, IoPeopleOutline } from "react-icons/io5";
import { PiHouseSimple, PiShoppingCart, PiNewspaper } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate, useLoaderData } from 'react-router-dom'
import { BiLogOut } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import CandyLogo from '../../assets/images/candylogo.png'
import DashSearch from '../../assets/components/DashSearch/DashSearch.jsx'
import Api from "../../utils/request";
import './dashBoard.css'

const DashTitle = () => {
  return (
    <div className='dash-title'>
      <img src={CandyLogo} alt="logo da marca" />
      <p>Candy Land</p>
      <Link to={'/'} className='dash-back-button'><IoReturnDownBack /></Link>
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
      <DashBtn name={'Visão Geral'} icon={<PiHouseSimple />} url={'DashBoard'} />
      <DashBtn name={'Produtos'} icon={<PiShoppingCart />} url={'Produtos'} />
      <DashBtn name={'Pedidos'} icon={<PiNewspaper />} url={'Pedidos'} />
      <DashBtn name={'Clientes'} icon={<IoPeopleOutline />} url={'Clientes'} />
    </div>
  )
}

const ContentHeader = ({ response, setSearchResponse }) => {
  const [input, setInput] = useState('')
  const inputRef = useRef();

  function handleChange(e) {
    setInput(prev => prev = e.target.value)
  }

  function handleSearch(e) {
    if (e.keyCode === 13) {
      if (input === '') {
        setSearchResponse(prev => prev = {
          user: [],
          product: []
        })
      }

      Api.dashSearch(input)
        .then(result => setSearchResponse({
          user: result.data[0],
          product: result.data[1]
        }))
        .catch(err => console.log("Ocorreu um erro ao carregar!"))
    }
  }

  return (
    <div className="content-header">
      <div className="content-search">
        <button><IoIosSearch /></button>
        <input
          onChange={handleChange}
          onKeyDown={handleSearch}
          type="text"
          placeholder="Pesquise produtos, clientes, etc..." 
          ref={inputRef}
          />
        {input !== '' && <button
          className="remove-search"
          onClick={() => {
            setSearchResponse(prev => prev = { user: [], product: [] });
            setInput(prev => prev = '');
            inputRef.current.value = ''
          }}>X</button>}
      </div>

      <div className="header-perfil">
        <div className="header-perfil-img"></div>
        <div className="header-perfil-names">
          <p>{`${response.data.user.nome.toUpperCase()} ${response.data.user.sobrenome.toUpperCase()}`}</p>
          <p className="header-perfil-tag">Admin</p>
        </div>
      </div>
    </div>
  )
}

export default function DashBoard() {
  const response = useLoaderData()
  const [searchResponse, setSearchResponse] = useState({
    user: [],
    product: []
  })

  if (response.data.user.role < 1) {
    return (
      <p>Acesso negado</p>
    )
  }

  const [currentPage, setPage] = useState('Visão Geral')
  const acceptPages = ["Produtos", "Pedidos", "Clientes"];

  //Mantem o menu selecionado mesmo depois de reload
  useEffect(() => {
    let currentPage = (window.location.pathname).split('/').reverse()
    if (acceptPages.includes(currentPage[0])) {
      setPage(currentPage[0])
    }
  }, [])

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
        <ContentHeader response={response} setSearchResponse={setSearchResponse} />
        {searchResponse.user.length > 0 || searchResponse.product.length > 0 ? <DashSearch data={searchResponse} setData={setSearchResponse} /> : <Outlet />}
      </div>
    </div>
  )
}