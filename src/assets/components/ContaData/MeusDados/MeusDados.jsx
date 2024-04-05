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
      <div className='info-campo-valor'>{valor}</div>
    </div>
  )
}

export default function MeusDados({ data }) {
  // console.log(data)
  return (
    <div className="meus-dados-container">
      <h5>Dados da Conta</h5>
      <InfoBlock>
        <InfoCampo chave={'EMAIL'} valor={data.email} />
        <InfoCampo chave={'CPF'} valor={data.cpf} />
        <button className='info-block-btn'>Mudar Senha</button>
      </InfoBlock>

      <InfoBlock title={'Informações'}>
        <InfoCampo chave={'NOME COMPLETO'} valor={`${data.nome} ${data.sobrenome}`} />
        <InfoCampo chave={'TELEFONE'} valor={data.telefone} />
        <InfoCampo chave={'SEXO'} valor={data.sexo} />
        <InfoCampo chave={'DATA DE NASCIMENTO'} valor={data.data_de_nascimento} />
      </InfoBlock>

      <InfoBlock title={'Endereço de entrega'}>
        <InfoCampo chave={'CEP'} valor={data.endereco.cep} />
        <InfoCampo chave={'LOGRADOURO'} valor={data.endereco.logradouro} />
        <InfoCampo chave={'NÚMERO'} valor={data.endereco.numero} />
        <InfoCampo chave={'COMPLEMENTO'} valor={data.endereco.complemento} />
        <InfoCampo chave={'BAIRRO'} valor={data.endereco.bairro} />
        <InfoCampo chave={'CIDADE'} valor={data.endereco.cidade} />
        <InfoCampo chave={'ESTADO'} valor={data.endereco.estado} />
        <InfoCampo chave={'REFERÊNCIA'} valor={data.endereco.referencia} />
      </InfoBlock>
    </div>
  )
}