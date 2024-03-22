import { BsFillTelephoneInboundFill, BsWhatsapp } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import img1 from '../../images/payment/footer-pay1.png'
import img2 from '../../images/payment/footer-pay2.png'
import img3 from '../../images/payment/footer-pay3.png'
import img4 from '../../images/payment/footer-pay4.png'
import img5 from '../../images/payment/footer-pay5.png'
import img6 from '../../images/payment/footer-pay6.png'
import './footer.css'

const FooterTop = () => {
  return (
    <div className='content-top'>
      <ul>
        <li>
          <h5>ATENDIMENTO</h5>
          <div>
            <span>
              <BsFillTelephoneInboundFill className="footer-icon" />
              <p>(12) 3522-0466</p>
            </span>

            <span>
              <BsWhatsapp className="footer-icon" />
              <p>(12) 3522-0466</p>
            </span>

            <span>
              <TfiEmail className="footer-icon" />
              <p>candylandpinda@yahoo.com</p>
            </span>

          </div>
        </li>
        <li>
          <h5>ATENDIMENTO</h5>
          <div>
            <a href="">Fale Conosco</a>
            <a href="">Entregas</a>
            <a href="">Como comprar</a>
            <a href="">Avalie-nos</a>
            <a href="">Nossas Lojas</a>
          </div>
        </li>
        <li>
          <div>
            <h5>INSTITUCIONAL</h5>
            <a href="">Sobre nós</a>
            <a href="">Trocas e Devoluções</a>
            <a href="">Políticas de privacidade geral</a>
          </div>

        </li>
        <li>
          <div>
            <h5>INSTITUCIONAL</h5>
            <a href="">Sobre nós</a>
            <a href="">Trocas e Devoluções</a>
          </div>

        </li>
        <li>
          <div>
            <h5>SEGURANÇA</h5>
            <img src="https://www.rickdoces.com.br/estatico/rickdoces/template/assets/images/security.jpeg" alt="selo de segurança" />
          </div>

        </li>
      </ul>
    </div>
  )
}

const FooterBottom = () => {
  return (
    <div className="footer-bottom">
      <div className="payment-container">
        <h5>PAGUE COM</h5>
        <div className="payment-icons">
          <img src={img1} alt="" />
          <img src={img2} alt="" />
          <img src={img3} alt="" />
          <img src={img4} alt="" />
          <img src={img5} alt="" />
          <img src={img6} alt="" />
        </div>
      </div>

      <div>
        <h5 id="redes-sociais">REDES SOCIAIS</h5>
        <div className="payment-icons">
          <FaFacebookSquare />
          <FaInstagramSquare />
        </div>
      </div>

    </div>
  )
}

export default function Footer() {
  return (
    <footer>
      <div className='footer-content'>
        <FooterTop />
        <FooterBottom />

        <div className="footer-final">
          <p>TODOS OS DIREITOS RESERVADOS. FOTOS MERAMENTE ILUSTRATIVAS..
            CANDY LAND CNPJ: XXXXXXXXXXXX - DELÍCIAS ONLINE LTDA
            R DR RUBIÃO JÚNIOR Nº55 - Loja 17/18 -  GALERIA BARÃO GARDEN - CENTRO PINDAMONHANGABA -
            TEL: (12) 3522-0466</p>

          <div className="dev-name">
            <span>DESENVOLVIDO POR <a href="https://x-cloudy.github.io/Portifolio/">J.RODRIGUES</a></span>
          </div>
        </div>
      </div>
    </footer>
  )
}