import { Link } from "react-router-dom"
import './login.css'

export default function Login() {
  return (
    <div className='login-container'>
      <div className='login'>
        <h3>Faça seu login</h3>

        <form action="#" method="post" className='login-form'>
          <input className='login-input' type="text" placeholder='E-MAIL ou CPF' name='login' />
          <input className='login-input' type="password" placeholder='SENHA' name='senha' />
          <button type='submit'>Entrar</button>
        </form>

        <div className='cadastro-redirect'>
          <h3>Novo por aqui?</h3>
          <Link to={'/CandyLand/Cadastro'}>
            <button type='button'>Criei uma Conta</button>
          </Link>
        </div>
      </div>
    </div>
  )
}