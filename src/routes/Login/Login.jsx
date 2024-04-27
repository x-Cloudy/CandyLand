import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../context/AuthProvider"
import Api from "../../utils/request"
import './login.css'

export default function Login() {
  const { auth, handleLogin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [infos, setInfos] = useState({
    email: '',
    senha: ''
  })

  useEffect(() => {
    (async () => {
      try {
        if (auth) {
          navigate('/MinhaConta')
          return
        }
      } catch (err) {
        console.log('MinhaConta Effect', err)
      } finally {
        setLoading(false)
      }
    })()

  }, [auth]);


  

  function getInfos(e) {
    setInfos({
      ...infos,
      [e.target.name]: e.target.value
    })
  }

  async function login(e) {
    e.preventDefault();
    try {
      await Api.login(infos);
      await handleLogin()
      navigate('/MinhaConta')
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Tratar o erro de forma apropriada, como mostrar uma mensagem para o usuário
    }
  }

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <div className='login-container'>
      <div className='login'>
        <h3>Faça seu login</h3>

        <form className='login-form'>
          <input className='login-input' type="text" placeholder='E-MAIL ou CPF' name='email' onChange={getInfos} />
          <input className='login-input' type="password" placeholder='SENHA' name='senha' onChange={getInfos} />
          <button onClick={login}>Entrar</button>
        </form>

        <div className='cadastro-redirect'>
          <h3>Novo por aqui?</h3>
          <Link to={'/Cadastro'}>
            <button type='button'>Criei uma Conta</button>
          </Link>
        </div>
      </div>
    </div>
  )
}