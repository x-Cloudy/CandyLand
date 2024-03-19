import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import './home.css'

export default function Home() {
  return (
    <div className='home-container'>
      <Banner />
      <Perks />
    </div>
  )
}