import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import Products from '../../assets/components/Products/Products'
import product1 from '../../assets/images/produTeste/product1png.png'
import ProdutosData from '../../data/ProdutosData'
import { useLoaderData } from 'react-router-dom'
import './home.css'

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

export async function productsData() {
  const data = await ProdutosData();
  return { data }
}

export default function Home() {
  const { data } = useLoaderData()

  return (
    <div className='home-container'>
      <Banner />
      <Perks />
      <Products title={'LANÇAMENTOS'} data={data}/>
    </div>
  )
}