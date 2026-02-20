import { Home } from "./pages/home"
import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import CerrarSesion from "./pages/cerrarSesion"
import HomeLoged from "./pages/home-loged"
import Afiliarse from "./pages/Afiliarse"
import CrearNegocio from "./pages/crearNegocio"
import UnirseNegocio from "./pages/unirseNegocio"
import { Inventario } from "./pages/inventario"
import Precios from "./pages/precios"
import Historial from "./pages/historial"
import { BrowserRouter,Routes,Route,Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

function App() {
  const [logeado,setLogueado] = useState(false)

  useEffect(() => {

    supabase.auth.onAuthStateChange((event, session) => {
      setLogueado(!!session); // !!session convierte el objeto a true/false
    });

},[])
  

  return (
    <div className="bg-zinc-950 text-slate-100 min-h-screen">
     <BrowserRouter>
     {logeado && 
     <nav className="h-full">
      <Link to={'/home'}>Home</Link>
      <br/>
      <Link to={'/inventario'}>Inventario</Link>
      <br/>
      <Link to={'/precios'}>Lista de precios</Link>
      <br/>
      <Link to={'/historial'}>Historial</Link>
      <br/>
      <Link to={'/cerrarSesion'}>Cerrar Sesion</Link>
      <br/>
     </nav> }
     <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element ={<Home/>}/>
          <Route path="/login" element ={<Login/>}/>
          <Route path="/register" element ={<Register/>}/>
          <Route path="/home" element ={<HomeLoged/>}/>
          <Route path="/inventario" element ={<Inventario/>}/>
          <Route path="/precios" element ={<Precios/>}/>
          <Route path="/cerrarSesion" element ={<CerrarSesion/>}/>
          <Route path="/unirseNegocio" element ={<UnirseNegocio/>}/>
          <Route path="/crearNegocio" element ={<CrearNegocio/>}/>
          <Route path="/afiliarse" element ={<Afiliarse/>}/>
          <Route path="/historial" element ={<Historial/>}/>

        </Routes>
      </main>
     </BrowserRouter>
    </div>
  )
}

export default App
