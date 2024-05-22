import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Cart, Category, Home, Login, Product } from "./pages"

import bannermens from "./assets/bannermens.png"
import bannerwomens from "./assets/bannerwomens.png"
import bannerkids from "./assets/bannerkids.png"
import ShopContextProvider from './context/ShopContext.jsx'

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
        path: "/mens",
        element: <Category category="mens" banner={bannermens} />
      },
      {
        path: "/womens",
        element: <Category category="womens" banner={bannerwomens} />
      },
      {
        path: "/kids",
        element: <Category category="kids" banner={bannerkids} />
      },
      {
        path: "/product/:productId",
        element: <Product />
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
    <ShopContextProvider>
      <RouterProvider router={AppRouter} />
    </ShopContextProvider>
  </React.StrictMode>,
)
