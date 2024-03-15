import Header from './assets/components/Header/Header'
import Footer from './assets/components/Footer/Footer'
import './App.css'

function App() {
  const DivTeste = () => {
    return <div className='divTeste'></div>
  }


  return (
    <div className='container'>
      <Header />
      <DivTeste />
      <Footer />
    </div>
  )
}

export default App
