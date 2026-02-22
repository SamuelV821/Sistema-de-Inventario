import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function CrearNegocio(){
    const [nombre,setNombre] = useState('');
    const [id_auth,setId_auth] = useState();
    const navigate = useNavigate();

    const generarCodigoAleatorio = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let resultado = '';
        for (let i = 0; i < 6; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    };

    const nuevoNegocio = async () => {

        console.log("ID del usuario logueado:", id_auth); // <-- Ponlo AQUÍ
        if (!id_auth) {
        console.error("No hay ID de usuario. El RLS va a fallar.");
        return;
        }

        let intentos = 0;
        let exito = false;
        let codigo = generarCodigoAleatorio();
        
        while (!exito &&intentos<5){
            const { data,error:errorInsertar } = await supabase
            .from('negocios')
            .insert({ nombre:nombre, codigo:codigo, id_owner:id_auth }).select().single();
            codigo = generarCodigoAleatorio();
            intentos++;
            if(!errorInsertar){
                console.log('Negocio creado');
                const { error:errorUpdate } = await supabase
                .from('perfiles')
                .update({ id_negocio: data.id,dueno: true })
                .eq('id_auth', id_auth )

                if(!errorUpdate){
                    exito=true;
                    navigate('/home')
                }
                else{
                    console.log('Fallo el update')
                }

                }
                
        }

        if(!exito){
            console.log('Error');

        }
        else{
            navigate('/home')
        }
        
    }

    useEffect(() => {
        const comprobarSesion = async () => {
        const { data: { session } } = await supabase.auth.getSession();       
        // Si hay sesión activa, lo mandamos al panel de control
        if (!session) {
            navigate('/');
        }
        else{
            setId_auth(session.user.id);
        }
        }
    
        comprobarSesion();
    },[]);

    return(
        <>
        <div className="h-screen w-full flex items-center justify-center">
            <div className="bg-zinc-800/30 rounded-2xl flex flex-col p-6 gap-8 items-center justify-center">
                <span className="bg-emerald-500/30 p-3 rounded-3xl text-5xl">🏗️</span>
                <div className="flex flex-row font-black gap-2 p-2 text-3xl italic"><span>Configura tu</span><span className="text-emerald-500">Negocio</span></div>
                <p className="text-slate-300/40 text-sm font-light">Ponle un nombre a tu imperio comercial.</p>
                <span className="font-black text-slate-300">NOMBRE DE TU NEGOCIO</span>
                <input className="bg-zinc-950 rounded-2xl p-6 text-center font-black" placeholder="NEGOCIO" type="text" onChange={(e) => setNombre(e.target.value)} value={nombre}/>
                <p className="w-80 bg-emerald-900/30 rounded-2xl p-5 text-emerald-200 text-xs ">Se generará automáticamente un código único para que tus empleados puedan unirse a este negocio.</p>
                <button className="w-60 font-black text-zinc-950 mt-5 bg-emerald-500 shadow-md shadow-emerald-500/50 hover:shadow-indigo-500/90 hover:text-zinc-800 transition-all text-center rounded-2xl p-5 " onClick={()=>nuevoNegocio()}>Crear</button>
                <button onClick={() => navigate('/afiliarse')}>Volver atras</button>

            </div>

        </div>
        </>
        
    )


}
export default CrearNegocio