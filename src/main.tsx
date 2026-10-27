import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import './index.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Footer from './components/Footer.tsx'
import About from './pages/About.tsx'
import Logoin from './pages/Login.tsx'
import Order from './pages/Order.tsx'
import ManageAmount from './pages/ManageAmount.tsx'
import History from './pages/History.tsx'
import { UserProvider } from './context/userContext.tsx'
import MyCart from './pages/MyCart.tsx'
import { Provider } from 'react-redux'
import { store } from './store.ts'


import { QueryClient, QueryClientProvider, } from "@tanstack/react-query";
import Home from './pages/Home.tsx'
import MannageThisItem from './pages/MannageThisItem.tsx'
import ShowAllCustomersForMannager from './components/ShowAllCustomersForManager.tsx'
import Policy from './pages/Policy.tsx'
import AsPayment from './pages/AsPayment.tsx'
import AddProduct from './components/AddProduct.tsx'

const queryClient = new QueryClient();

// פריסה משותפת - הפוטר מוצג בכל הדפים
const Layout = () => <>
  <Outlet />
  <Footer />
</>

const routers = createBrowserRouter([{
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/About",
      element: <About />
    },

    {
      path: "/Login",
      element: <Logoin />
    },

    {
      path: "/ManageAmount",
      element: <ManageAmount />
    },
    {
      path: "/MannageThisItem/:id",
      element: <MannageThisItem />
    },

    {
      path: "/Order",
      element: <Order />
    },

    {
      path: "/AsPayment",
      element: <AsPayment />
    },


    {
      path: "/AddProduct",
      element: <AddProduct />
    },
    {
      path: "/ShowAllCustomersForMannager",
      element: <ShowAllCustomersForMannager />
    },

    {
      path: "/History",
      element: <History />
    },

    {
      path: "/MyCart",
      element: <MyCart />
    },

    {
      path: "/Policy",
      element: <Policy />
    },

    // {
    //   path: "/Connecting",
    //   element: <App />
    // }

  ]
}])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {/* <App /> */}
          <RouterProvider router={routers} />
        </UserProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
