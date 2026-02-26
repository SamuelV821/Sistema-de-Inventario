import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function UnirseNegocio(){
    const [id_auth,setId_auth] = useState('');
    const [codigo,setCodigo] = useState('')
    const navigate = useNavigate();


    const unirseNegocio = async () => {
        //console.log('id_auth:',id_auth)
        
        const { data, error:errorSelect } = await supabase
        .from('negocios')
        .select()
        .eq('codigo', codigo).maybeSingle() // El estado que captura lo que escribís

        if(!data){
            alert('El negocio no existe');
            return;
        }

        if(!errorSelect){
            console.log('se encontro el negocio',data.id)
            const { error:errorUpdate } = await supabase
            .from('perfiles')
            .update({ id_negocio: data.id })
            .eq('id_auth', id_auth)

            if(!errorUpdate){
                console.log('cambiado con exito');
                navigate('/home')
            }
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
        <div className="h-screen w-full flex items-center justify-center">
        <div className="bg-zinc-800/30 rounded-2xl flex flex-col p-6 gap-8 items-center justify-center">
            <span className="bg-indigo-500/30 p-3 rounded-3xl text-5xl">🔑</span>
            <div className="flex flex-row font-black gap-2 p-2 text-3xl italic"><span>Unirse a un </span><span className="text-indigo-500">Negocio</span></div>
            <p className="text-slate-300/40 text-sm font-light">Ingresa el código que te proporcionó el administrador.</p>
            <span className="font-black text-slate-300">CÓDIGO DE ACCESO</span>
            <input className="bg-zinc-950 rounded-2xl p-6 text-center font-black" placeholder="EJ: ABC123" type="text" onChange={(e) => setCodigo(e.target.value)} value={codigo}/>
            <p className="bg-indigo-900/30 rounded-2xl p-5 text-indigo-200 text-xs ">Al unirte, podrás ver el stock y cargar ventas en tiempo real.</p>
            <button className="w-60 font-black text-zinc-950 mt-5 bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-800 transition-all text-center rounded-2xl p-5 " onClick={()=>unirseNegocio()}>Unirse</button>
            <button onClick={() => navigate('/afiliarse')}>Volver atras</button>

        </div>

        </div>
    )

}
export default UnirseNegocio