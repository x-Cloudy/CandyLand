import { useEffect } from 'react'
import './dashBoard.css'

export default function DashBoard() {

  useEffect(() => {
    fetch('https://mockend.com/api/mockend/demo/posts')
    .then(response => console.log(response))
  }, [])

  return (
    <div className='dashboard-container'>
      <div className='dashboard'>

      </div>
    </div>
  )
}