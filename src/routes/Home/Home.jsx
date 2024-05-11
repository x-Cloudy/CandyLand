import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import Products from '../../assets/components/Products/Products'
import { useLoaderData } from 'react-router-dom'
import './home.css'

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