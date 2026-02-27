import { useNavigate } from "react-router-dom"

function Afiliarse(){
    const navigate = useNavigate();
    return(
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 gap-8">

            <div className="flex flex-row text-2xl md:text-5xl font-black italic">
                <span>¡Bienvenido a Click</span><span className="text-emerald-500">Venta</span><span>!</span>
            </div>

            <p className="text-slate-300 text-sm font-light">Para empezar a gestionar tu stock, primero necesitamos configurar tu espacio de trabajo.</p>

            <div className="flex flex-col md:flex-row p-4 gap-8">
                <div className="bg-zinc-700/30 rounded-2xl flex flex-col p-4 md:p-10 gap-6 md:w-100 items-center justify-center">
                    <span className="bg-emerald-500/30 p-3 rounded-3xl text-5xl">🏪</span>
                    <span className="font-black text-2xl">Crear un negocio</span>
                    <p className="text-slate-300 text-sm font-light">Soy el dueño. Quiero configurar mi inventario y empleados.</p>
                    <div className="flex flex-row gap-2 font-black text-emerald-500 hover:text-emerald-500/50 transition-all"><button onClick={() => (navigate('/crearNegocio'))}>Empezar</button><span>⮕</span></div>
                </div>
                <div className="bg-zinc-700/30 rounded-2xl flex flex-col p-4 md:p-10 gap-6 md:w-100 items-center justify-center">
                    <span className="bg-indigo-500/30 p-3 rounded-3xl text-5xl">🔑</span>
                    <span className="font-black text-2xl">Unirse a un negocio</span>
                    <p className="text-slate-300 text-sm font-light">Soy empleado. Mi jefe me dio un código de acceso.</p>
                    <div className="flex flex-row gap-2 font-black text-indigo-500 hover:text-indigo-500/50 transition-all"><button onClick={() => (navigate('/unirseNegocio'))}>Ingresar</button><span>⮕</span></div>
                </div>
            </div>
            <div className="flex flex-row p-4 gap-2 text-slate-400 hover:text-slate-400/50"><span className="font-black">🡐</span><button onClick={() => (navigate('/cerrarSesion'))} className="font-black">Salir de la sesion</button></div>
        </div>
    )
}
export default Afiliarse