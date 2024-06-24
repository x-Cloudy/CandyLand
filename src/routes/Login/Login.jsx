import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../context/AuthProvider"
import CircularColor from "../../assets/components/Loading/Loading"
import Api from "../../utils/request"
import validation from "../../utils/validation"
import './login.css'

export default function Login() {
  const { auth, handleLogin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [infos, setInfos] = useState({
    email: '',
    senha: ''
  })
  const [error, setError] = useState({
    code: '',
    msg: ''
  })

  useEffect(() => {
    (async () => {
      try {
        if (auth) {
          navigate('/MinhaConta')
          return
        }
      } catch (err) {
        console.log("Ocorreu um erro ao carregar!")
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
    const { valid, erro } = validation.valid("login", infos)
    if (!valid) {
      setError({
        ...error,
        msg: erro
      })
      return
    }

    try {
      await Api.login(infos);
      await handleLogin()
      navigate('/MinhaConta')
    } catch (error) {
      setError({
        code: error.response.status,
        msg: error.response.data
      })
    }
  }

  const ErrorModule = ({ msg }) => {
    return (
      <p className="error-module">{msg}</p>
    )
  }

  if (loading) {
    return <div className='loading-meus-dados'><CircularColor /></div>
  }

  return (
    <>
      {loading ? <div className='loading-meus-dados'><CircularColor /></div> : <div className='login-container'>
        <div className='login'>
          <h3>Faça seu login</h3>

          <form className='login-form'>
            <input className='login-input' type="text" placeholder='E-MAIL' name='email' onChange={getInfos} />
            <input className='login-input' type="password" placeholder='SENHA' name='senha' onChange={getInfos} />
            {error.msg && <ErrorModule msg={error.msg} />}
            <button onClick={login}>Entrar</button>
          </form>

          <div className='cadastro-redirect'>
            <h3>Novo por aqui?</h3>
            <Link to={'/Cadastro'}>
              <button type='button'>Criei uma Conta</button>
            </Link>
          </div>
        </div>
      </div>}
    </>

  )
}