import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { CartProvider } from './context/cartContext.jsx'
import App from './App.jsx'
import Home, { productsData } from './routes/Home/Home.jsx'
import MinhaConta, { userLoader } from './routes/MinhaConta/MinhaConta.jsx'
import Login from './routes/Login/Login.jsx'
import Cadastro from './routes/Cadastro/Cadastro.jsx'
import Produtos from './routes/Produtos/Produtos.jsx'
import Categorias, { getCategorias } from './routes/Categorias/Categorias.jsx'
import ErrorPage from './assets/components/ErrorPage/error-page.jsx'
import DashBoard from './routes/DashBoard/DashBoard.jsx'
import DashGeral from './assets/components/DashGeral/DashGeral.jsx'
import DashProdutos from './assets/components/DashProdutos/DashProdutos.jsx'
// import getTransacoe from './data/transacao.js'
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
        path: "MinhaConta",
        element: <MinhaConta />,
        loader: userLoader
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
  {
    path: "/CandyLand/DashBoard",
    element: <DashBoard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/CandyLand/DashBoard",
        element: <DashGeral />,
      },
      {
        path: "Produtos",
        element: <DashProdutos />,
        children: [
          {
            path: "editar/:id",
            element: <p>teste</p>
          }
        ]
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
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
)
