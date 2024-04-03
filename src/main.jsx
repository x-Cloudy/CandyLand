import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { CartProvider } from './context/cartContext.jsx'
import App from './App.jsx'
import Home, { productsData } from './routes/Home/Home.jsx'
import Login from './routes/Login/Login.jsx'
import Cadastro from './routes/Cadastro/Cadastro.jsx'
import Produtos from './routes/Produtos/Produtos.jsx'
import Categorias, { getCategorias } from './routes/Categorias/Categorias.jsx'
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
        element: <Home />,
        loader: productsData
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Cadastro",
        element: <Cadastro />,
      },
      {
        path: "Produtos/:produtosId",
        element: <Produtos />,
        loader: productsData
      },
      {
        path: "Categorias/:categoriaId/:pageId",
        element: <Categorias />,
        loader: getCategorias,
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
)
