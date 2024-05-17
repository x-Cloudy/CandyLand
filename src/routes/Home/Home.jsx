import { useEffect, useState } from 'react'
import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import Products from '../../assets/components/Products/Products'
import Api from '../../utils/request'
import './home.css'

export default function Home() {
  const [data, setData] = useState({
    lancamento: null,
    bala: null
  })


  useEffect(() => {
    (async () => {
      const lancamento = await Api.searchNewProducts();
      const bala = await Api.searchCategoria('Bala');

      setData({
        lancamento: lancamento.data,
        bala: bala.data
      })
    })();
  }, [])

  return (
    <div className='home-container'>
      <Banner />
      <Perks />
      {data.lancamento && <Products title={'LANÇAMENTOS'} data={data.lancamento}/>}
      {data.lancamento && <Products title={'BALAS'} data={data.bala}/>}
    </div>
  )
}