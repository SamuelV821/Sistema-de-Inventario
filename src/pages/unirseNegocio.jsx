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
        .eq('codigo', codigo) // El estado que captura lo que escribís

        if(!errorSelect){
            //console.log('se encontro el negocio',data[0].id)
            const { error:errorUpdate } = await supabase
            .from('perfiles')
            .update({ id_negocio: data[0].id })
            .eq('id_auth', id_auth)

            if(!errorUpdate){
                //console.log('cambiado con exito');
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
        <>
        <input type="text" onChange={(e) => setCodigo(e.target.value)} value={codigo}/>
        <button onClick={()=>unirseNegocio()}>Unirse</button>
        </>
    )

}
export default UnirseNegocio