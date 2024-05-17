import chocolate from '../../images/menuIcons/chocolate.svg'
import biscoito from '../../images/menuIcons/biscoito.svg'
import bala from '../../images/menuIcons/bala.svg'
import bebidas from '../../images/menuIcons/bebidas.svg'
import conveniencia from '../../images/menuIcons/conveniencia.svg'
import snaks from '../../images/menuIcons/snaks.svg'
import coreanos from '../../images/menuIcons/linha-fit.svg'
import novidades from '../../images/menuIcons/novidades.svg'
import promocoes from '../../images/menuIcons/promocoes.svg'

import { IoIosCloseCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import './header.css'

export default function MenuTable({ props }) {
  const { setMenuOpen } = props;

  return (
    <div className='menu-table-container'>
      <div className='menu-table'>
        <div className='menu-table-header'>
          <h3>Categorias</h3>
          <button onClick={() => setMenuOpen(false)}><IoIosCloseCircle /></button>
        </div>

        <ul>
          <li>
            <Link to={'Categorias/Chocolate/1'} onClick={() => setMenuOpen(false)}>
              <p>CHOCOLATE</p>
              <img src={chocolate} alt="chocolate" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Biscoito/1'} onClick={() => setMenuOpen(false)}>
              <p>BISCOITO</p>
              <img src={biscoito} alt="biscoito" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Bala/1'} onClick={() => setMenuOpen(false)}>
              <p>BALA</p>
              <img src={bala} alt="bala" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Bebidas/1'} onClick={() => setMenuOpen(false)}>
              <p>BEBIDA</p>
              <img src={bebidas} alt="bebidas" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Conveniencia/1'} onClick={() => setMenuOpen(false)}>
              <p>CONVENIÊNCIA</p>
              <img src={conveniencia} alt="conveniencia" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Snaks/1'} onClick={() => setMenuOpen(false)}>
              <p>SNACKS</p>
              <img src={snaks} alt="snaks" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Coreanos/1'} onClick={() => setMenuOpen(false)}>
              <p>COREANOS</p>
              <img src={coreanos} alt="coreanos" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Novidades/1'} onClick={() => setMenuOpen(false)}>
              <p>NOVIDADES</p>
              <img src={novidades} alt="novidades" />
            </Link>
          </li>
          <li>
            <Link to={'Categorias/Promos/1'} onClick={() => setMenuOpen(false)}>
              <p>PROMOÇÔES</p>
              <img src={promocoes} alt="promocoes" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}