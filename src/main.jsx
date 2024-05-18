import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route
} from "react-router-dom"
import { CartProvider } from './context/cartContext.jsx'
import { AuthContext } from './context/AuthProvider.jsx'
import AlertProvider from './context/AlertContext.jsx'
import App from './App.jsx'
import Home from './routes/Home/Home.jsx'
import MinhaConta from './routes/MinhaConta/MinhaConta.jsx'
import Login from './routes/Login/Login.jsx'
import Cadastro from './routes/Cadastro/Cadastro.jsx'
import Produtos from './routes/Produtos/Produtos.jsx'
import Categorias from './routes/Categorias/Categorias.jsx'
import ErrorPage from './assets/components/ErrorPage/error-page.jsx'
import DashBoard from './routes/DashBoard/DashBoard.jsx'
import DashGeral from './assets/components/DashGeral/DashGeral.jsx'
import DashProdutos from './assets/components/DashProdutos/DashProdutos.jsx'
import SearchPage from './routes/SearchPage/SearchPage.jsx'
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
      },
      {
        path: "/search/:q/:pageId",
        element: <SearchPage />
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
      }
    ]
  },
  {
    path: "/",
    element: <DashBoard />,
    errorElement: <ErrorPage />,
    loader: async () => {
      return await Api.loadUserData();
    },
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
      <AlertProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
)
