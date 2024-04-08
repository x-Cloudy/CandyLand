import MeusDados from "../../assets/components/ContaData/MeusDados/MeusDados.jsx";
import MeusPedidos from "../../assets/components/ContaData/MeusPedidos/MeusPedidos.jsx";
import getUserInfo from "../../data/userInfo.jsx";
import product1 from '../../assets/images/produTeste/product1png.png'
import { MdAccountCircle } from "react-icons/md";
import { BsHandbagFill } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { useState } from "react";
import './minhaConta.css'

const ContaButton = ({ name, icon, menu }) => {
  const { activeMenu, setActiveMenu } = menu;

  return (
    <button className={activeMenu === name ? 'conta-btn-active' : 'conta-btn'} onClick={() => setActiveMenu(name)} >
      <div className="conta-btn-shadow"></div>
      <h4 className="conta-btn-h4">{icon}</h4>
      <p className="conta-btn-p">{name}</p>
    </button>
  )
}

const Pageswitch = ({ currentPage, userData }) => {

  switch (currentPage) {
    case "Meus dados":
      return <MeusDados data={userData} />
      break;

    case "Meus Pedidos":
      return <MeusPedidos data={userData}/>
      break;

    case "Meus favoritos":
      return <p>Meus favoritos</p>
      break;
  }
}


export default function MinhaConta() {
  const [activeMenu, setActiveMenu] = useState('Meus Pedidos')
  const [dataUser, setDataUser] = useState()
  
  async function showData() {
    const data = await getUserInfo()
    setDataUser(data)
  }
  showData()

  return (
    <div className='conta-container'>
      <div className='conta-header'>
        <div className='conta-backcolor'></div>
        <div className='conta-menu'>
          <h5>Olá Raquel</h5>
          <div className='conta-btns'>
            <ContaButton name={'Meus dados'} icon={<MdAccountCircle />} menu={{ activeMenu, setActiveMenu }} />
            <ContaButton name={'Meus Pedidos'} icon={<BsHandbagFill />} menu={{ activeMenu, setActiveMenu }} />
            <ContaButton name={'Meus favoritos'} icon={<IoIosHeart />} menu={{ activeMenu, setActiveMenu }} />
          </div>
        </div>
      </div>

      <div className="conta-pages">
        <Pageswitch currentPage={activeMenu} userData={dataUser} />
      </div>

    </div>
  )
}