import { supabase } from "../supabaseClient"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Precios(){
    const navigate = useNavigate();
    const [productos,setProductos] = useState([]);

    const pedirPrecios = async () => {
        const { data, error } = await supabase
        .from('productos')
        .select()

        if(!error){
            setProductos(data);
            console.log('Lista de precios recibida')
            setProductos(data);
        }

        else{
            console.log('Error:',error);
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
                const { data:perfiles, error } = await supabase
                .from('perfiles')
                .select().eq('id_auth',session.user.id);

                if(!error){
                    if(perfiles[0].id_negocio === null){
                        navigate('/');
                    }
                }
            }
        }
        comprobarSesion();
        pedirPrecios();

    },[]);



    return(
        <>
        {productos?.map((data) => (
            <div key={data.id}>
            <span>{data.producto} ${data.precio_venta}</span>
            <br />
            </div>
        ))}

        </>
    )
}

export default Precios