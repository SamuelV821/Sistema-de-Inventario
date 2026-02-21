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
import { NavbarMovil } from "./pages/menuDesplegable"
import { BrowserRouter,Routes,Route,Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

function App() {
  const [logeado,setLogueado] = useState(false);
  const [afiliado,setAfiliado] = useState(false);

  useEffect(() => {

    supabase.auth.onAuthStateChange((event, session) => {
      setLogueado(!!session); // !!session convierte el objeto a true/false
    });

    async function verificarNegocio(){
      const { data: { session } } = await supabase.auth.getSession();
      const { data:perfiles, error } = await supabase.from('perfiles').select().eq('id_auth',session.user.id);
      if(perfiles[0].id_negocio === null){
        setAfiliado(true);
      }
    }

},[])
  

  return (
    <div className="bg-zinc-950 text-slate-100 min-h-screen flex flex-col md:flex-row p-4">
     <BrowserRouter>
     {(logeado) && 
     <nav className="bg-zinc-800/30 md:h-lvh md:sticky top-4 flex flex-row md:flex-col items-start p-4 gap-2 md:gap-6 rounded-2xl border-white/5 border-1">
      <div className='bg-zinc-950 rounded-2xl p-2'>
          <div className="flex items-center gap-1 tracking-tight">
              <span className="text-2xl font-black text-slate-100 italic">Click</span>
              <span className="text-2xl font-black text-emerald-500 italic">Venta</span>
              <div className="h-2 w-2 bg-emerald-500 boxsh rounded-full mt-3 shadow-[0_0_10px_#10b981] animate-pulse"></div>
          </div>
      </div>
      <br />
      <NavbarMovil/>
      <Link className="bg-zinc-950 hover:bg-indigo-950/70 border-white/5 hidden border-2 hover:text-indigo-200 rounded-2xl w-40 p-4 md:flex items-center justify-center" to={'/home'}>Home</Link>
      <Link className="bg-zinc-950 hover:bg-indigo-950/70 border-white/5 hidden border-2 hover:text-indigo-200 rounded-2xl w-40 p-4 md:flex items-center justify-center" to={'/inventario'}>Inventario</Link>
      <Link className="bg-zinc-950 hover:bg-indigo-950/70 border-white/5 hidden border-2 hover:text-indigo-200 rounded-2xl w-40 p-4 md:flex items-center justify-center" to={'/precios'}>Precios</Link>
      <Link className="bg-zinc-950 hover:bg-indigo-950/70 border-white/5 hidden border-2 hover:text-indigo-200 rounded-2xl w-40 p-4 md:flex items-center justify-center" to={'/historial'}>Historial</Link>
      <Link className="bg-zinc-950 hover:bg-indigo-950/70 border-white/5 hidden border-2 hover:text-indigo-200 rounded-2xl w-40 p-4 md:flex items-center justify-center" to={'/cerrarSesion'}>Cerrar Sesion</Link>
     </nav> }
     <main className="flex-1 p-6 md:col-span-8">
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
