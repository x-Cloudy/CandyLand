import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route
} from "react-router-dom"
import { CartProvider } from './context/cartContext.jsx'
import { AuthContext } from './context/AuthProvider.jsx'
import App from './App.jsx'
import Home, { productsData } from './routes/Home/Home.jsx'
import MinhaConta from './routes/MinhaConta/MinhaConta.jsx'
import Login from './routes/Login/Login.jsx'
import Cadastro from './routes/Cadastro/Cadastro.jsx'
import Produtos from './routes/Produtos/Produtos.jsx'
import Categorias, { getCategorias } from './routes/Categorias/Categorias.jsx'
import ErrorPage from './assets/components/ErrorPage/error-page.jsx'
import DashBoard from './routes/DashBoard/DashBoard.jsx'
import DashGeral from './assets/components/DashGeral/DashGeral.jsx'
import DashProdutos from './assets/components/DashProdutos/DashProdutos.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import Api from './utils/request.js'
import './index.css'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => {
          return await Api.get("products")
        }
      },
      {
        path: "Login",
        element: <Login />
      },
      {
        path: "Cadastro",
        element: <Cadastro />,
      },
      {
        path: "MinhaConta",
        element: <MinhaConta />,
      },
      {
        path: "Produtos/:produtosId",
        element: <Produtos />,
      },
      {
        path: "Categorias/:categoriaId/:pageId",
        element: <Categorias />,
        loader: async () => {
          return await Api.get("products")
        }
      }
    ]
  },
  {
    path: "/",
    element: <DashBoard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "DashBoard",
        element: <DashGeral />,
      },
      {
        path: "Produtos",
        element: <DashProdutos />,
      },
      {
        path: "Pedidos",
        element: <p>Pedidos</p>
      },
      {
        path: "Clientes",
        element: <p>Clientes</p>
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)
