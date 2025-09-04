
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
import Exsubcategory from './pages/exsubcategory/Exsubcategory'


function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
        <Route path="/banner" element={<Banner/>} />
        <Route path="/header" element={<Header/>} />
        <Route path="/category" element={<Category />} />
        <Route path="/subcategory" element={<Subcategory/>} />
        <Route path="/exsubcategory" element={<Exsubcategory/>} />
        <Route path="/product" element={<Product/>} />
       
      </Routes>
    </BrowserRouter>

  )
}

export default App
