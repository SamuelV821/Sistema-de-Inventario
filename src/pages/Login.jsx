import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect } from "react";

export function Login (){
    const [user,setUser] = useState({
        email:'',
        password:''
    });
    const navigate = useNavigate();

     useEffect(() => {
            const comprobarSesion = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                
                // Si hay sesión activa, lo mandamos al panel de control
                if (session) {
                    navigate('/home');
                }
            }
            comprobarSesion();
        },[])

    const manejarDatos = (e) => {
        const {name,value} = e.target;
        setUser({...user,[name]:value});
    }

    const LoguearUsuruario = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password,
        });

        if(!error){
            console.log('Inicio de sesion Correcto');
            navigate('/home');
        }
        else{
            alert('E-mail o Contraseña Incorrecta');
            console.log('Error:',error);
        }
    }

    return (
        <div    className="h-screen flex items-center justify-center">

            <div className="flex flex-col bg-zinc-400/10 rounded-3xl w-fit p-8 gap-8 items-center justify-center">

                <div className="flex items-center gap-3 tracking-tight font-black text-4xl">
                    <span className="text-slate-100 italic">Click</span>
                    <span className="text-emerald-500 italic">Venta</span>
                </div>

                <p className="text-center font-light text-slate-300 text-xs">Ingresa tus credenciales para continuar.</p>        
            
                <form className="flex flex-col p-10 gap-6 text-slate-400" onSubmit={(e) => LoguearUsuruario(e)}>

                    <label className="font-black">E-mail</label>
                    <input className="bg-zinc-950 p-4 border-zinc-700/60 border-1 text-center rounded-2xl" type="mail" name="email" placeholder="usuario@mail.com" onChange={(e) => manejarDatos(e)} value={user.email} />
                    <label className="font-black">Contraseña</label>
                    <input className="bg-zinc-950 p-4 border-zinc-700/60 border-1 text-center rounded-2xl" type="password" name="password" placeholder="********" onChange={(e) => manejarDatos(e)} value={user.password} />
                    <button className="text-zinc-950 mt-5 bg-emerald-500 shadow-md shadow-emerald-500/50 hover:shadow-emerald-500/90 hover:text-zinc-800 transition-all text-center rounded-2xl p-4 " type="submit">Enviar</button>

                </form>

                <div className="flex flex-row p-2 gap-2">
                    <span>¿Olvidaste tu contraseña?</span><button className="text-emerald-500" onClick={() => navigate('/contacto')}>Contacta con soporte</button>
                </div>
                
                <div className="flex flex-row p-2 gap-2">
                    <span>¿No tiene una cuenta?</span><button className="text-emerald-500" onClick={() => navigate('/register')}>¡Registrate ahora!</button>
                </div>
                

            </div>

        </div>
    );
}

