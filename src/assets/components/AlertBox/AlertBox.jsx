import { useContext } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import './alertBox.css'


export default function AlertBox() {
  const { alert, closeAlert } = useContext(AlertContext)

  if (!alert.active) return

  setTimeout(() => {
    closeAlert()
  }, 2500)
  return (
    <div className='custom-alertBox'>
      <div className='alert-box'>
        <h2>Olá ( •̀ ω •́ )✧</h2>
        <p>{alert.text}</p>
        <button onClick={() => closeAlert()}>Close</button>
      </div>
    </div>
  )
}