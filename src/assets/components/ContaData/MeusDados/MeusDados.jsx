import { useEffect, useState } from 'react'
import Api from '../../../../utils/request'
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
      setInputValue(prev => prev = response.data.user.endereco)
      setLoading(prev => prev = false)
    })();
  }, [])

  async function sendDataToApi() {
    await Api.sendAddress(inputValue)
  }


  return (
    <div className='adress-page-container'>
      <div className='adress-page'>
        <button className='adress-page-closeBtn' onClick={() => closeFunc(false)}>X</button>

        <div className='adress-page-inputs'>
          {!loading ? <>
            <AdressInput name={'cep'} label={'Cep'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'logradouro'} label={'Logradouro'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'numero'} label={'Número'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'complemento'} label={'Complemento'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'bairro'} label={'Bairro'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'cidade'} label={'Cidade'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'estado'} label={'Estado'} handleChange={{ inputValue, setInputValue }} />
            <AdressInput name={'referencia'} label={'Referência'} handleChange={{ inputValue, setInputValue }} />
          </> : <p>Carregando...</p>}

        </div>

        <button onClick={sendDataToApi} className='adress-page-enviar'>Enviar</button>
      </div>
    </div>
  )
}

export default function MeusDados({ data }) {
  const [adressPage, setAdressPage] = useState(false)

  return (
    <>
      {adressPage && <AdressPage closeFunc={setAdressPage} />}
      {data ? (<div className="meus-dados-container">
        <h5>Dados da Conta</h5>
        <InfoBlock>
          <InfoCampo chave={'EMAIL'} valor={data.email} />
          <InfoCampo chave={'CPF'} valor={data.cpf} />
          <button className='info-block-btn'>Mudar Senha</button>
        </InfoBlock>

        <InfoBlock title={'Informações'}>
          <InfoCampo chave={'NOME COMPLETO'} valor={`${data.nome} ${data.sobrenome}`} />
          <InfoCampo chave={'TELEFONE'} valor={data.telefone} />
          <InfoCampo chave={'SEXO'} valor={data.genero} />
          <InfoCampo chave={'DATA DE NASCIMENTO'} valor={data.idade} />
        </InfoBlock>

        <InfoBlock title={'Endereço de entrega'}>
          <InfoCampo chave={'CEP'} valor={data.endereco ? data.endereco.cep : ''} />
          <InfoCampo chave={'LOGRADOURO'} valor={data.endereco ? data.endereco.logradouro : ''} />
          <InfoCampo chave={'NÚMERO'} valor={data.endereco ? data.endereco.numero : ''} />
          <InfoCampo chave={'COMPLEMENTO'} valor={data.endereco ? data.endereco.complemento : ''} />
          <InfoCampo chave={'BAIRRO'} valor={data.endereco ? data.endereco.bairro : ''} />
          <InfoCampo chave={'CIDADE'} valor={data.endereco ? data.endereco.cidade : ''} />
          <InfoCampo chave={'ESTADO'} valor={data.endereco ? data.endereco.estado : ''} />
          <InfoCampo chave={'REFERÊNCIA'} valor={data.endereco ? data.endereco.referencia : ''} />
        </InfoBlock>
        <button className='adress-page-button' onClick={() => setAdressPage(true)} style={{ opacity: adressPage ? '0' : '1' }}>Cadastrar endereço</button>
      </div>) : (<p>Carregando...</p>)}
    </>
  )

}