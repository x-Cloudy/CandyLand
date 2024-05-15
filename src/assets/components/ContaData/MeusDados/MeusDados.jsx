import { useEffect, useState } from 'react'
import axios from 'axios';
import Api from '../../../../utils/request'
import validation from '../../../../utils/validation';
import { useNavigate } from 'react-router-dom'
import './meusDados.css'

const InfoBlock = ({ children, title }) => {
  return (
    <div className='info-bloco'>
      {title && <h4>{title}</h4>}
      {children}
    </div>
  )
}

const InfoCampo = ({ chave, valor }) => {
  return (
    <div className='info-campo'>
      <div className='info-campo-chave'>{chave}</div>
      {valor && <div className='info-campo-valor'>{valor}</div>}
    </div>
  )
}

const AdressInput = ({ name, label, handleChange }) => {
  const { inputValue, setInputValue } = handleChange;

  function getAdressInput(e) {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='adress-input'>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} name={name} onChange={getAdressInput} placeholder={inputValue[name]} value={inputValue[name]} />
    </div>
  )
}


const AdressPage = ({ closeFunc }) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia: ''
  })

  useEffect(() => {
    (async () => {
      const response = await Api.loadUserData();
      if (response.data.user.endereco) {
        setInputValue(prev => prev = response.data.user.endereco)
      }
      setLoading(prev => prev = false)
    })();
  }, [])

  async function sendDataToApi() {
    const { isValid, erro } = await validation.valid("endereco", inputValue)

    if (!isValid) {
      setError(erro)
      return
    } else {
      setError('')
    }

    await Api.sendAddress(inputValue)
  }


  return (
    <div className='adress-page-container'>
      <div className='adress-page'>
        <button className='adress-page-closeBtn' onClick={() => closeFunc(false)}>X</button>

        <div className='adress-page-inputs'>
          {!loading ? <>
            <AdressInput name={'cep'} label={'Cep'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'logradouro'} label={'Endereço'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'numero'} label={'Número'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'complemento'} label={'Complemento'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'bairro'} label={'Bairro'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'cidade'} label={'Cidade'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'estado'} label={'Estado'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'referencia'} label={'Referência'} handleChange={{ inputValue, setInputValue }} />
          </> : <p>Carregando...</p>}

        </div>

        {error && <p style={{ display: 'flex', alignSelf: 'center', transform: 'translate(0px, -20px)', color: 'red', fontWeight: 'bold' }}>{error}</p>}

        <button onClick={sendDataToApi} className='adress-page-enviar'>Enviar</button>
      </div>
    </div>
  )
}

const PasswordPage = ({ handleClose }) => {
  const [changeStates, setChangeStates] = useState({
    isValid: false,
    msg: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    loading: false,
    complete: false
  })

  useEffect(() => {
    if (changeStates.complete) {
      Api.logout()
    }
  }, [changeStates.complete])

  function getInfos(e) {
    setChangeStates({
      ...changeStates,
      [e.target.name]: e.target.value
    })
  }

  async function verifyOldPassword() {

    if (changeStates.oldPassword.length > 20 || changeStates.oldPassword.length < 5) {
      setChangeStates(prev => ({
        ...prev,
        msg: "A senha não atende a quatidade de caracters necessários (5-20)"
      }))
      return
    }

    if (changeStates.oldPassword.match(/[\[{<(]/)) {
      setChangeStates(prev => ({
        ...prev,
        msg: "A senha não pode contar caracteres especias como {, [ ou ("
      }))
      return
    }


    setChangeStates(prev => ({
      ...prev,
      loading: true
    }));

    const id = localStorage.getItem("id");
    const jwt = await Api.getJwt();
    try {
      await axios({
        method: "POST",
        url: "https://localhost:4000/passwordVerify",
        data: {
          id: id,
          senha: changeStates.oldPassword
        },
        headers: {
          "Authorization": jwt
        }
      });
      setChangeStates(prev => ({
        ...prev,
        isValid: true
      }));
    } catch (e) {
      setChangeStates(prev => ({
        ...prev,
        msg: e.response.data
      }));
    } finally {
      setChangeStates(prev => ({
        ...prev,
        loading: false
      }));
    }
  }

  async function changePassword() {
    if (changeStates.newPassword !== changeStates.confirmNewPassword) {
      setChangeStates(prev => ({
        ...prev,
        msg: "As senhas devem ser iguais"
      }))
      return
    }

    if (changeStates.newPassword.length > 20 || changeStates.newPassword.length < 5) {
      setChangeStates(prev => ({
        ...prev,
        msg: "A senha não atende a quatidade de caracters necessários (5-20)"
      }))
      return
    }

    if (changeStates.newPassword.match(/[\[{<(]/) || changeStates.confirmNewPassword.match(/[\[{<(]/)) {
      setChangeStates(prev => ({
        ...prev,
        msg: "A senha não pode contar caracteres especias como {, [ ou ("
      }))
      return
    }

    setChangeStates(prev => ({
      ...prev,
      loading: true
    }))

    const id = localStorage.getItem('id');
    const jwt = await Api.getJwt()

    try {
      await axios({
        method: "POST",
        url: "https://localhost:4000/changePassword",
        data: {
          id: id,
          senha: changeStates.newPassword
        },
        headers: {
          "Authorization": jwt
        }
      })
      setChangeStates(prev => ({
        ...prev,
        msg: 'Senha atualizada com sucesso',
        complete: true
      }))
    } catch (e) {
      setChangeStates(prev => ({
        ...prev,
        msg: e.response.data
      }))
    } finally {
      setChangeStates(prev => ({
        ...prev,
        loading: false
      }))
    }
  }

  return (
    <div className='change-password-container'>
      {!changeStates.isValid && <div className='change-password-inputs'>
        <label htmlFor="old-password" className='change-password-label'>Para mudar sua senha confirme sua senha antiga</label>
        <input type="text" id='old-password' className='change-password-input' name='oldPassword' onChange={getInfos} />
        {changeStates.msg && <p style={{ margin: '10px', color: 'red', fontWeight: 'bold' }}>{changeStates.msg}</p>}
        {changeStates.loading && <p>Carregando...</p>}
        <div>
          <button onClick={verifyOldPassword} className='change-password-old-btn'>Enviar</button>
          <button onClick={() => handleClose(false)} className='change-password-cancel'>Cancelar</button>
        </div>

      </div>}

      {changeStates.isValid && <div className='change-password-inputs'>
        <label htmlFor="new-password" className='change-password-label'>Nova senha</label>
        <input type="text" id='new-password' className='change-password-input' name='newPassword' onChange={getInfos} />

        <label htmlFor="confirm-password" className='change-password-label'>Confirmar senha</label>
        <input type="text" id='confirm-password' className='change-password-input' name='confirmNewPassword'
          onChange={getInfos} />
        {changeStates.msg && <p style={{ margin: '10px', color: `${changeStates.complete ? 'green' : 'red'}`, fontWeight: 'bold' }}>{changeStates.msg}</p>}
        {changeStates.loading && <p>Carregando...</p>}
        <div>
          <button onClick={changePassword} className='change-password-old-btn'>Enviar</button>
          <button onClick={() => handleClose(false)} className='change-password-cancel'>Cancelar</button>
        </div>
      </div>}
    </div>
  )
}

export default function MeusDados({ data }) {
  const [adressPage, setAdressPage] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {changePassword && <PasswordPage handleClose={setChangePassword} />}
      {adressPage && <AdressPage closeFunc={setAdressPage} />}
      {data ? (<div className="meus-dados-container">
        <h5>Dados da Conta</h5>
        <InfoBlock>
          <InfoCampo chave={'EMAIL'} valor={data.email} />
          <InfoCampo chave={'CPF'} valor={data.cpf} />
          <button
            onClick={() => setChangePassword(true)}
            className='change-password-btn'>
            Mudar Senha
          </button>
        </InfoBlock>

        <InfoBlock title={'Informações'}>
          <InfoCampo chave={'NOME COMPLETO'} valor={`${data.nome[0].toUpperCase() + data.nome.slice(1)} ${data.sobrenome[0].toUpperCase() + data.sobrenome.slice(1)}`} />
          <InfoCampo chave={'TELEFONE'} valor={data.telefone} />
          <InfoCampo chave={'SEXO'} valor={data.genero} />
          <InfoCampo chave={'DATA DE NASCIMENTO'} valor={new Date(data.idade).toLocaleString('pt-BR', { timeZone: 'UTC'}).slice('0', '10')} />
        </InfoBlock>
        <InfoBlock title={'Endereço de entrega'}>
          <InfoCampo chave={'CEP'} valor={data.endereco ? data.endereco.cep : ''} />
          <InfoCampo chave={'ENDEREÇO'} valor={data.endereco ? data.endereco.logradouro : ''} />
          <InfoCampo chave={'NÚMERO'} valor={data.endereco ? data.endereco.numero : ''} />
          <InfoCampo chave={'COMPLEMENTO'} valor={data.endereco ? data.endereco.complemento : ''} />
          <InfoCampo chave={'BAIRRO'} valor={data.endereco ? data.endereco.bairro : ''} />
          <InfoCampo chave={'CIDADE'} valor={data.endereco ? data.endereco.cidade : ''} />
          <InfoCampo chave={'ESTADO'} valor={data.endereco ? data.endereco.estado : ''} />
          <InfoCampo chave={'REFERÊNCIA'} valor={data.endereco ? data.endereco.referencia : ''} />
        </InfoBlock>
        <div className='meus-dados-end-buttons'>
          <button className='adress-page-button' onClick={() => setAdressPage(true)} style={{ opacity: adressPage ? '0' : '1' }}>Cadastrar endereço</button>


          <button className='logout-button'
            onClick={() => Api.logout()}
          >Sair</button>
        </div>
        {data.role === 1 && <button onClick={() => navigate('/DashBoard')} className='dashboard-open-btn'>DashBoard</button>}

      </div>) : (<p>Carregando...</p>)}
    </>
  )

}