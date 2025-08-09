import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Details from './pages/Details'
import Otp from './pages/Otp'
import Upload from './pages/Upload'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ChatApp from './pages/ChatApp'
import FoodDetails from './pages/FoodDetails'

const App = () => {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}  />
        <Route path='/upload' element={<Upload/>}  />
        <Route path='/details' element={<Details/>}  />
        <Route path='/otp' element={<Otp/>}  />
        <Route path='/signin' element={<Signin/>}  />
        <Route path='/signup' element={<Signup/>}  />
        <Route path='/chat' element={<ChatApp/>}  />
        <Route path='/food' element={<FoodDetails/>}  />
      </Routes>
    </BrowserRouter>
  )
}

export default App
