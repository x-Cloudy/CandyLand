import MeusDados from "../../assets/components/ContaData/MeusDados/MeusDados.jsx";
import product1 from '../../assets/images/produTeste/product1png.png'
import { MdAccountCircle } from "react-icons/md";
import { BsHandbagFill } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { useState } from "react";
import './minhaConta.css'

const userInfos = {
  email: 'teste@1234.com',
  cpf: '99988877766',
  nome: 'Raquel',
  sobrenome: 'Rodrigues',
  telefone: '1299998888',
  sexo: 'Femenino',
  data_de_nascimento: '01/07/1996',
  endereco: {
    cep: '12400-400',
    logradouro: 'Rua teste',
    numero: '301',
    complemento: '',
    bairro: 'Parq do teste',
    cidade: 'São José',
    estado: 'SP',
    referencia: 'casa rosa'
  },
  favoritos: [
    {
      id: 1,
      name: 'FERREIRO ROCHER',
      img: product1,
      price: 39.90,
      promo: true,
      discount: 25,
      disponivel: 1,
      desc: {
        marca: 'Ferrero',
        peso: '90g',
        origem: 'Europa',
        contem: 'GLÚTEM E LACTOSE.',
        texto: `FERRERO ROCHER ORIGINAL uma barra com a 
          incrivel combinação de chocolate ao leite e avelãs.`,
      },
    }
  ],
  pedidos: [

  ]
}


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

const Pageswitch = ({ currentPage }) => {
  switch (currentPage) {
    case "Meus dados":
      return <MeusDados data={userInfos} />
      break;

    case "Meus Pedidos":
      return <p>Meus Pedidos</p>
      break;

    case "Meus favoritos":
      return <p>Meus favoritos</p>
      break;
  }
}

export default function MinhaConta() {
  const [activeMenu, setActiveMenu] = useState('Meus dados')

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
        <Pageswitch currentPage={activeMenu} />
      </div>

    </div>
  )
}