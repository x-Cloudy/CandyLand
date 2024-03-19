import { SiHomeadvisor } from "react-icons/si";
import { FaCreditCard } from "react-icons/fa6";
import { FaTruckArrowRight } from "react-icons/fa6";
import { BsShieldLockFill } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import './perks.css'
import { useEffect, useState } from "react";

export default function Parks() {
  const [mobile, setMobile] = useState(true)

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      if (e.target.innerWidth > 1000) {
        setMobile(prev => prev = false)
      } else {
        setMobile(prev => prev = true)
      }
    })


    return () => {
      window.removeEventListener('resize', (e) => {
        if (e.target.innerWidth > 1000) {
          setMobile(prev => prev = false)
        } else {
          setMobile(prev => prev = true)
        }
      })
    }
  },[])
  
  return (
    <div className='perks-container'>
      <div className='perks'>
        <div className="perks-item-container">
          <div className="perks-item"><SiHomeadvisor /></div>
          <h5>RECEBA EM CASA</h5>
          <p>em todo Brasil</p>
        </div>
        
        <div className="perks-item-container">
          <div className="perks-item"><FaCreditCard /></div>
          <h5>PARCELAMENTO</h5>
          <p>em até 12x no cartão</p>
        </div>

        <div className="perks-item-container">
          <div className="perks-item"><FaTruckArrowRight /></div>
          <h5>ENTREGA RÁPIDA</h5>
          <p>para grande SP</p>
        </div>

        <div className="perks-item-container">
          <div className="perks-item"><BsShieldLockFill /></div>
          <h5>SEGURANÇA</h5>
          <p>em toda sua compra</p>
        </div>

        {!mobile && <div className="perks-item-container">
          <div className="perks-item"><FaHandHoldingUsd /></div>
          <h5>PAGAMENTOS</h5>
          <p>via Boleto, Pix ou Cartão</p>
        </div>}

      </div>
    </div>
  )
}