
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Banner from './component/Banner/banner'
import Category from './pages/category/Category'
import Product from './pages/product/Product'
import Register from './component/Register/Register'
import Login from './component/Login/Login'
import Header from './component/Header/header'
import Subcategory from './pages/subcategory/Subcategory'
import Merchant from './pages/merachant/merchantForm'
import Customers from './pages/customers/Customers'
import Size from './pages/size/Size'
import Color from './pages/color/Color'
import Stock from './pages/stock/Stock'
import CustomerBill from './pages/customerBill/CustomerBill'
import CustomerBillItem from './pages/customerBillItem/CustomerBillItem'
import ForgotPassword from './component/Forgotpassword/forgotpassword'
import Newpass from './component/NewPassword/newpass'
import Otp from './component/Otp/otp'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Invoice from './pages/Invoice/invoice'
import InvoicePrint from './pages/invoice Detail/invoice-Detail'


function App() {

  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/newpass" element={<Newpass />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/header" element={<Header />} />
        <Route path="/category" element={<Category />} />
        <Route path="/subcategory" element={<Subcategory />} />
        <Route path="/product" element={<Product />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/size" element={<Size />} />
        <Route path="/color" element={<Color />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customersbill" element={<CustomerBill />} />
        <Route path="/customersbillitem" element={<CustomerBillItem />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoicePrint" element={<InvoicePrint />} />

      </Routes>
    </BrowserRouter>

  )
}

export default App
