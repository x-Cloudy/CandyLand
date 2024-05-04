import Api from '../../utils/request'
import validation from '../../utils/validation'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const [error, setError] = useState({
    code: '',
    msg: ''
  })
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    idade: '',
    genero: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmSenha: ''
  })
  const [type, setType] = useState(false)

  function handleForm(e) {
    setForm({
      ...form,
      [e.target.name]: (e.target.value).toLowerCase()
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { valid, erro } = await validation.valid("register", form)
    if (!valid) {
      setError({
        msg: erro
      });
      return
    } else {
      setError({
        msg: erro
      })
      setTimeout(() => {
        navigate('/Login')
      }, 1000)
    }

    const response = await Api.register(form);
    if (response.status === 201) {
      setError({
        code: response.status,
        msg: "Usuário cadastrado com sucesso!"
      })

    } else {
      setError({
        msg: "Erro ao cadastrar usuário, tente novamente mais tarde"
      })
    }
  }

  const ErrorModule = ({ msg, code }) => {
    let cName = code == 201 ? "no-error-module" : "error-module";
    return (
      <p className={cName}>{msg}</p>
    )
  }


  return (
    <div className='cadastro-container'>
      <div className='cadastro'>
        <h3>Criei uma conta</h3>

        <form action="" method="post" className='cadastro-form' onSubmit={handleSubmit}>
          <input className='cadastro-input' type="text" placeholder='Nome' name='nome' onChange={handleForm} minLength={4} />

          <input className='cadastro-input' type="text" placeholder='Sobrenome' name='sobrenome' onChange={handleForm} />
          <input className='cadastro-input colSpan' type="email" placeholder='E-mail' name='email' onChange={handleForm} />

          <input className='cadastro-input' type="date" placeholder='Data de nascimento' name='idade' onChange={handleForm} />

          <select name='genero' className='cadastro-input' onChange={handleForm} defaultValue={''}>
            <option value="" hidden>Genero</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="naoInformar">Não informar</option>
          </select>

          <input className='cadastro-input colSpan'
            type="text" placeholder='CPF' name='cpf' onChange={handleForm} minLength="11"
            maxLength="14" pattern="^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}" />

          <input className='cadastro-input colSpan' type="text" placeholder='Telefone' name='telefone' onChange={handleForm} />

          <div className='password-input-cadastro'>
            <input className='cadastro-input' type={type ? "text" : "password"} placeholder='Senha' name='senha' onChange={handleForm} />
            <span className='password-eye' onClick={() => setType(!type)}>{type ? <FaEye /> : <FaEyeSlash />}</span>
          </div>

          <div className='password-input-cadastro'>
            <input className='cadastro-input' type={type ? "text" : "password"} placeholder='Confirmar Senha' name='confirmSenha' onChange={handleForm} />
          </div>
          <button type='submit' value={'button'}>Criar conta</button>
        </form>

        {error.msg && <ErrorModule msg={error.msg} code={error.code} />}

      </div>
    </div>
  )
}