import product1 from '../assets/images/produTeste/product1png.png'

const userInfos = {
  email: 'teste@1234.com',
  cpf: '99988877766',
  nome: 'Raquel',
  sobrenome: 'Rodrigues',
  telefone: '1299998888',
  sexo: 'Femenino',
  data_de_nascimento: '01/07/1996',
  endereco: {
    cep: '12400-400',
    logradouro: 'Rua teste',
    numero: '301',
    complemento: '',
    bairro: 'Parq do teste',
    cidade: 'São José',
    estado: 'SP',
    referencia: 'casa rosa'
  },
  favoritos: [
    {
      id: 1,
      name: 'FERREIRO ROCHER',
      img: product1,
      price: 39.90,
      promo: true,
      discount: 25,
      disponivel: 1,
      desc: {
        marca: 'Ferrero',
        peso: '90g',
        origem: 'Europa',
        contem: 'GLÚTEM E LACTOSE.',
        texto: `FERRERO ROCHER ORIGINAL uma barra com a 
          incrivel combinação de chocolate ao leite e avelãs.`,
      },
    },
    {
      id: 2,
      name: 'FERREIRO ROCHER',
      img: product1,
      price: 39.90,
      promo: true,
      discount: 25,
      disponivel: 1,
      desc: {
        marca: 'Ferrero',
        peso: '90g',
        origem: 'Europa',
        contem: 'GLÚTEM E LACTOSE.',
        texto: `FERRERO ROCHER ORIGINAL uma barra com a 
          incrivel combinação de chocolate ao leite e avelãs.`,
      },
    },
    {
      id: 3,
      name: 'FERREIRO ROCHER',
      img: product1,
      price: 39.90,
      promo: true,
      discount: 25,
      disponivel: 1,
      desc: {
        marca: 'Ferrero',
        peso: '90g',
        origem: 'Europa',
        contem: 'GLÚTEM E LACTOSE.',
        texto: `FERRERO ROCHER ORIGINAL uma barra com a 
          incrivel combinação de chocolate ao leite e avelãs.`,
      },
    },
    {
      id: 4,
      name: 'FERREIRO ROCHER',
      img: product1,
      price: 39.90,
      promo: true,
      discount: 25,
      disponivel: 1,
      desc: {
        marca: 'Ferrero',
        peso: '90g',
        origem: 'Europa',
        contem: 'GLÚTEM E LACTOSE.',
        texto: `FERRERO ROCHER ORIGINAL uma barra com a 
          incrivel combinação de chocolate ao leite e avelãs.`,
      },
    },
  ],
  pedidos: [
    {
      id: '1',
      img: product1,
      numero_pedido: 'CL01',
      nome: 'FERREIRO ROCHER',
      marca: 'Ferrero',
      total: '39',
      data: '24/11/2023',
      origem: 'Europa',
      quantidade: '1'
    },
    {
      id: '2',
      img: product1,
      numero_pedido: 'CL01',
      nome: 'FERREIRO ROCHER',
      marca: 'Ferrero',
      total: '39',
      data: '24/11/2023',
      origem: 'Europa',
      quantidade: '1'
    },
  ]
}

export default function getUserInfo() {
  return new Promise((resolve) => {
    resolve(userInfos)
  })
}