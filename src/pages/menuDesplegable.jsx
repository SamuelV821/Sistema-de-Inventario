import { useState } from 'react';
import { Link } from 'react-router-dom';

export function NavbarMovil() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="md:hidden"> {/* Solo se ve en celulares */}
      
      {/* BOTÓN HAMBURGUESA */}
      <button 
        onClick={() => setAbierto(!abierto)}
        className="fixed top-8 right-5 z-50 p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20"
      >
        {abierto ? '✕' : '☰'}
      </button>

      {/* MENÚ DESPLEGABLE (OVERLAY) */}
      <div className={`
        fixed inset-0 bg-zinc-950/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300
        ${abierto ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}>
        <Link to="/home" onClick={() => setAbierto(false)} className="text-2xl font-black text-slate-100">Home</Link>
        <Link to="/inventario" onClick={() => setAbierto(false)} className="text-2xl font-black text-slate-100">Inventario</Link>
        <Link to="/precios" onClick={() => setAbierto(false)} className="text-2xl font-black text-slate-100">Precios</Link>
        <Link to="/historial" onClick={() => setAbierto(false)} className="text-2xl font-black text-slate-100">Historial</Link>
        <Link to="/cerrarSesion" onClick={() => setAbierto(false)} className="text-red-500 font-bold">Cerrar Sesión</Link>
      </div>
    </div>
  );
}