import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Cart, Category, Home, Login, Product } from "./pages"

// App Router for all the routes defined for our app
const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/product",
        element: <Product />
      },
      {
        path: "/:productId",
        element: <Product />
      },
      {
        path: "/mens",
        element: <Category />
      },
      {
        path: "/womens",
        element: <Category />
      },
      {
        path: "/checkout",
        element: <Cart />
      },
      {
        path: "/login",
        element: <Login />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={AppRouter} />
  </React.StrictMode>,
)
