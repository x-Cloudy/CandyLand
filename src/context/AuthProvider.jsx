import { createContext, useState, useEffect } from "react";
import Api from "../utils/request";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(false)
  
  useEffect(() => {
    (async () => {
      try {
        const data = await Api.verify();
        if (data) {
          setAuth(true)
        }
      } catch (err) {
        console.log('AuthEffect', err)
      }
    })()
  }, [])

  async function handleLogin() {
    try {
      const data = await Api.verify()
      if (data) {
        setAuth(true)
      }
    } catch (err) {
      console.log('HandleLogin', err)
    }

  }

  return (
    <AuthContext.Provider value={{ auth, handleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}