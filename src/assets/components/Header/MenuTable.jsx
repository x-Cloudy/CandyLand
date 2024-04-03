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

              <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/chocolate.svg" alt="" />
            </Link>
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