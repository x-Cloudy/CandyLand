import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import App from './App.jsx'
import Home from './routes/Home/Home.jsx'
import Login from './routes/Login/Login.jsx'
import Cadastro from './routes/Cadastro/Cadastro.jsx'
import ErrorPage from './assets/components/ErrorPage/error-page.jsx'
import './index.css'


const router = createBrowserRouter([
  {
    path: "/CandyLand",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/CandyLand",
        element: <Home />
      },
      {
        path: "/CandyLand/Login",
        element: <Login />,
      },
      {
        path: "/CandyLand/Cadastro",
        element: <Cadastro />,
      },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
