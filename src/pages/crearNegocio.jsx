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
        <input type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} />
        <button onClick={()=> nuevoNegocio()}>Crear</button>
        </>
        
    )


}
export default CrearNegocio