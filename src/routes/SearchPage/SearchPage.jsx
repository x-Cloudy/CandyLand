import { useEffect, useState } from 'react'
import Api from '../../utils/request'
import './searchPage.css'

export default function SearchPage() {
  const [data, setData] = useState()
  const id = location.pathname.split('/')[2]
  const idFilter = decodeURIComponent(id)
  useEffect(() => {
    console.log(idFilter)
    Api.searchInput(idFilter)
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }, [id])
  
  return (
    <div className='searchPage-container'>

    </div>
  )
}