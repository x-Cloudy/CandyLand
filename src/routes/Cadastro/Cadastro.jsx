import Api from '../../utils/request'
import { useState } from 'react'
import './cadastro.css'

export default function Cadastro() {
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

  function handleForm(e) {
    setForm({
      ...form,
      [e.target.name]: (e.target.value).toLowerCase()
    })
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    for (let values of e.target) {
      if (values.value === '') {
        alert('Preecha todos os campos')
        return
      } 
    }
    
    if (form.senha !== form.confirmSenha) {
      console.log('A senha precisam estar identicas')
      return
    }
    const response = await Api.register(form);
    console.log(response)
  }


  return (
    <div className='cadastro-container'>
      <div className='cadastro'>
        <h3>Criei uma conta</h3>

        <form action="" method="post" className='cadastro-form' onSubmit={handleSubmit}>
          <input className='cadastro-input' type="text" placeholder='Nome' name='nome' onChange={handleForm} pattern="[a-zA-Z]+"/>

          <input className='cadastro-input' type="text" placeholder='Sobrenome' name='sobrenome' onChange={handleForm} pattern="[a-zA-Z]+" />
          <input className='cadastro-input colSpan' type="email" placeholder='E-mail' name='email' onChange={handleForm}  />

          <input className='cadastro-input' type="date" placeholder='Data de nascimento' name='idade' onChange={handleForm}  />

          <select name='genero' className='cadastro-input' onChange={handleForm}  defaultValue={''}>
            <option value="" hidden>Genero</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="naoInformar">Não informar</option>
          </select>

          <input className='cadastro-input colSpan'
            type="text" placeholder='CPF' name='cpf' onChange={handleForm} minLength="11"
            maxLength="14" pattern="^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}"  />

          <input className='cadastro-input colSpan' type="text" placeholder='Telefone' name='telefone' onChange={handleForm}  />

          <input className='cadastro-input' type="text" placeholder='Senha' name='senha' onChange={handleForm}  />

          <input className='cadastro-input' type="text" placeholder='Confirmar Senha' name='confirmSenha' onChange={handleForm}  />

          <button type='submit' value={'button'}>Criar conta</button>
        </form>

      </div>
    </div>
  )
}