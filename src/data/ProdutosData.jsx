import product1 from '../assets/images/produTeste/product1png.png'

const dataTeste = [
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
    discount: 15,
    disponivel: 0,
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
    discount: 30,
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
    promo: false,
    discount: 15,
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
  
]

export default function ProdutosData() {
  return new Promise((resolve, reject) => {
    resolve(dataTeste)
  })
}