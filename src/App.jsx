import Header from './assets/components/Header/Header'
import Footer from './assets/components/Footer/Footer'
import AlertBox from './assets/components/AlertBox/AlertBox'
import { Outlet } from 'react-router-dom'
import './App.css'



function App() {
  return (
    <div className='container'>
      <Header />
      <AlertBox />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
