import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export function Home(){
    const navigate = useNavigate();
    const whatsappUrl = `https://wa.link/pqd8r0`;

    useEffect(() => {
        const comprobarSesion = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Si hay sesión activa, lo mandamos al panel de control
            if (session) {
                navigate('/home');
            }
        }
        comprobarSesion();
    },[]);

    

    return(
        <div className="flex flex-col p-4 gap-8">
            <div className='bg-zinc-900/30 rounded-2xl flex flex-col md:flex-row items-center justify-between p-4 gap-8'>
                {/*Logo*/}
                <div className='bg-zinc-950 rounded-2xl p-2'>
                    <div className="flex items-center gap-1 tracking-tight">
                        <span className="text-2xl font-black text-slate-100 italic">Click</span>
                        <span className="text-2xl font-black text-emerald-500 italic">Venta</span>
                        <div className="h-2 w-2 bg-emerald-500 boxsh rounded-full mt-3 shadow-[0_0_10px_#10b981] animate-pulse"></div>
                    </div>
                </div>
                {/*Botones */}
                <div className="flex flex-row p-4 gap-6 items-center justify-center">
                    <button className=" hover:text-emerald-500 " onClick={() => navigate('/login')}>Ingresar</button>
                    <button className="bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-900 transition-all text-center rounded-2xl p-2 " onClick={() => navigate('/register')}>Registrarse</button>
                </div>  
            </div>

            <div className="bg-zinc-900/30 rounded-2xl min-h-30 w-full p-4 gap-8 flex flex-col">
                {/*Titulo y subtitulo*/}
                <div className="flex flex-col w-full items-center justify-center p-4 gap-8">
                    <div className="flex flex-row items-center justify-center gap-3 font-black text-3xl md:text-5xl">
                        <span>Gestioná tu stock con</span>
                        <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">un Click.</span>
                    </div>
                    <p className="text-slate-400 max-w-130 text-center ">El sistema mas rapido para
                     tu negocio. Control total de inventario, ventas en tiempo real y reportes automaticos.</p>

                </div>
                
                {/*Caracteristicas*/}
                <div className="grid grid-cols-1 md:grid-cols-3 w-full p-4 gap-8">
                    <div className="bg-zinc-400/10 min-h-30 col-span-1 rounded-2xl p-4 gap-8 animate">
                        <span className="text-emerald-500 text-2xl">📦</span>
                        <h3 className="text-xl font-bold text-slate-100">Inventario</h3>
                        <p className="text-slate-400 text-sm">Control total de stock con alertas inteligentes.</p>
                    </div>

                    <div className="bg-zinc-400/10 min-h-30 col-span-1 rounded-2xl p-4 gap-8">
                        <span className="text-emerald-500 text-2xl">💰</span>
                        <h3 className="text-xl font-bold text-slate-100">Venta Rápida</h3>
                        <p className="text-slate-400 text-sm">Facturación en segundos para que el cliente no espere.</p>
                    </div>

                    <div className="bg-zinc-400/10 min-h-30 col-span-1 rounded-2xl p-4 gap-8">
                        <span className="text-emerald-500 text-2xl">📈</span>
                        <h3 className="text-xl font-bold text-slate-100">Historial</h3>
                        <p className="text-slate-400 text-sm">Reportes detallados de tus movimientos diarios.</p>
                    </div>

                    
                </div>
                {/*Precio*/}
                <div className=" flex flex-col md:flex-row w-full items-center justify-center gap-2">

                    <div className="p-4 gap-1 flex flex-col items-center md:border-r border-white/5">
                        
                        <div className="flex flex-col md:flex-row text-2xl font-black p-4 gap-2">

                            <span>
                                Un solo plan,
                            </span>

                            <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                todo el poder.
                            </span>

                        </div>

                        <p className="text-slate-400 text-center">Sin letras chicas ni limites ocultos.</p>

                    </div>
                 
                    <div className="bg-zinc-900/30 rounded-2xl border-emerald-400/10 border-2 flex flex-col p-4 gap-6 items-center justify-center">
                        <span className="bg-emerald-800 rounded-2xl p-2 text-emerald-500 font-medium">ACCESO COMPLETO</span>
                        <div className="flex flex-row gap-2 p-4">
                            <span className="font-black text-4xl">$25.000</span><span>ars/mes</span>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span> Productos Ilimitados
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span> Soporte por WhatsApp
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span> Reportes de ventas diarios
                            </li>
                        </ul>
                        <button onClick={() => navigate('/register')} className="bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-900 transition-all text-center rounded-2xl p-2 ">¡Empezar Ahora!</button>
                    </div>

                </div>

            </div>

            <footer className="mt-auto w-full py-10 border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                            
                            {/* Lado Izquierdo: Marca */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1 tracking-tight">
                                    <span className="text-xl font-black text-slate-100 italic">Click</span>
                                    <span className="text-xl font-black text-emerald-500 italic">Venta</span>
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-2 shadow-[0_0_8px_#10b981]"></div>
                                </div>
                                <p className="text-zinc-500 text-sm">
                                    Potenciando comercios en Tartagal y el mundo.
                                </p>
                            </div>

                            {/* Lado Derecho: Links rápidos */}
                            <div className="flex gap-8 text-sm font-medium text-zinc-400">
                                <a href="/terminos" className="hover:text-emerald-500 transition-colors">Términos</a>
                                <a href="privacidad" className="hover:text-emerald-500 transition-colors">Privacidad</a>
                                <a href="mailto:contacto@samuel-v.dev" className="hover:text-emerald-500 transition-colors">Soporte</a>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">WhatsApp</a>
                            </div>

                            {/* Copyright */}
                            <div className="text-zinc-600 text-xs">
                                © 2026 ClickVenta. Todos los derechos reservados.
                            </div>
                        </div>
                    </footer>
        </div>
        
    );

    
}

