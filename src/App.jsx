import Header from './assets/components/Header/Header'
import Footer from './assets/components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import './App.css'



function App() {
  return (
    <div className='container'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
