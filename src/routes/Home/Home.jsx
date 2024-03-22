import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import Products from '../../assets/components/Products/Products'
import product1 from '../../assets/images/produTeste/product1png.png'
import './home.css'

import dateJson from './teste.json'

const dataTeste = [
  {
    id: 1,
    name: 'FERREIRO ROCHER 90g',
    img: product1,
    price: 39.90,
    promo: false,
    discount: 15,
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


export default function Home() {
  return (
    <div className='home-container'>
      <Banner />
      <Perks />
      <Products title={'LANÇAMENTOS'} data={dataTeste}/>
    </div>
  )
}