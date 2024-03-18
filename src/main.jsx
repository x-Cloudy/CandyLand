import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import App from './App.jsx'
import Home from './routes/Home/Home.jsx'
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
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
