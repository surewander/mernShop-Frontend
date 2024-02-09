import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignupPage from './routeComponents/SignupPageComponent/SignupPage';
import SigninPage from './routeComponents/SigninPageComponent/SigninPage';
import Navbar from './routeComponents/NavbarComponent/Navbar';
import GlobalWrapper from './GlobalWrapper';
import AddProductPage from './routeComponents/AddProductPageComponent/AddProductPage';
import ProductPageComonent from './routeComponents/ProductPageComponent/ProductPageComponent';
import CartPageComonent from './routeComponents/CartPageComponent/CartPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <SignupPage />
      },
      {
        path: "/sign-in",
        element: <SigninPage />
      },{
        
          path: "/add-product",
          element: <AddProductPage />
        
      },
      {
        path: '/products',
        element: <ProductPageComonent />
      },
      {
        path: '/cart',
        element: <CartPageComonent />
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalWrapper>

      <RouterProvider router={router} />
    </GlobalWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
