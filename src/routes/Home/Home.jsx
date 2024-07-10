import { useEffect, useState } from 'react'
import Banner from '../../assets/components/Banner/Banner'
import Perks from '../../assets/components/Perks/Perks'
import Products from '../../assets/components/Products/Products'
import CircularColor from '../../assets/components/Loading/Loading'
import Api from '../../utils/request'
import './home.css'

export default function Home() {
  const [data, setData] = useState({
    lancamento: null,
    bala: null,
    chocolate: null,
    bebidas: null,
    coreanos: null
  })


  useEffect(() => {
    (async () => {
      const lancamento = await Api.searchNewProducts();
      const bala = await Api.searchCarousel('Bala');
      const chocolate = await Api.searchCarousel('Chocolate');
      const bebidas = await Api.searchCarousel('Bebidas');
      const coreanos = await Api.searchCarousel('Coreanos');

      setData({
        lancamento: lancamento.data,
        bala: bala.data,
        chocolate: chocolate.data,
        bebidas: bebidas.data,
        coreanos: coreanos.data
      })
    })();
  }, [])

  return (
    <div className='home-container'>
      <Banner />
      <Perks />
      {data.lancamento ? <Products title={'LANÇAMENTOS'} data={data.lancamento}/> : <div className='loading-products'><CircularColor /></div>}
      {data.bala ? <Products title={'BALAS'} data={data.bala}/> : <div className='loading-products'><CircularColor /></div>}
      {data.chocolate ? <Products title={'CHOCOLATES'} data={data.chocolate}/> : <div className='loading-products'><CircularColor /></div>}
      {data.bebidas ? <Products title={'BEBIDAS'} data={data.bebidas}/> : <div className='loading-products'><CircularColor /></div>}
      {data.coreanos ? <Products title={'COREANOS'} data={data.coreanos}/> : <div className='loading-products'><CircularColor /></div>}
    </div>
  )
}