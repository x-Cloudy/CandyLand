import { createContext, useState } from "react";

export const AlertContext = createContext()

export default function AlertProvider({children}) {
  const [alert, setAlert] = useState({
    active: false,
    text: ''
  });

  const activeAlert = (texto) => {
    setAlert({
      active: true,
      text: texto
    })
  }

  const closeAlert = () => {
    setAlert({
      active: false,
      text: ''
    })
  }

  return (
    <AlertContext.Provider value={{alert, activeAlert, closeAlert}}>
      {children}
    </AlertContext.Provider>
  )
}