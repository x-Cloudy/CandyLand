import Header from './assets/components/Header/Header'
import './App.css'

function App() {
  const DivTeste = () => {
    return <div className='divTeste'></div>
  }


  return (
    <div className='container'>
     <Header />
      <DivTeste />
      <DivTeste />
      <DivTeste />
    </div>
  )
}

export default App
