import product1 from '../assets/images/produTeste/product1png.png'

const dataTeste = [
  {
    id: 0,
  },
  {
    id: 1,
    name: 'FERREIRO ROCHER 90g',
    img: product1,
    price: 39.90,
    promo: false,
    discount: 15,
    quantidade: 1,
    desc: {
      marca: 'FERRERO',
      peso: '90GR',
      origem: 'EUROPA',
      contem: 'GLÚTEM E LACTOSE.',
      texto: `FERRERO ROCHER ORIGINAL uma barra com a 
      incrivel combinação de chocolate ao leite e avelãs.`,
    },
  },
  {
    id: 2,
    name: 'chocolate',
    img: product1,
    price: 39.90,
    promo: true,
    discount: 15,
  },
  {
    id: 3,
    name: 'chocolate',
    img: product1,
    price: 39.90,
    promo: true,
    discount: 15,
  },
  {
    id: 4,
    name: 'chocolate',
    img: product1,
    price: 39.90,
    promo: true,
    discount: 15,
  },
]

export default function ProdutosData() {
  return new Promise((resolve, reject) => {
    resolve(dataTeste)
  })
}