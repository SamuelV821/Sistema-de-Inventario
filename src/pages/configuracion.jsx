import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom";

function Configuracion(){
    const [configuracion,setConfiguracion] = useState({
        codigo_negocio:'',
        nombre_negocio:'',
        nombre_usuario:'',
        email:''
    })
    const [id,setId] = useState({
        user:'',
        negocio:'',
    });
    const [id_sub,setId_sub] = useState('');
    const [dueno,setDueno] = useState(false);
    const [sub,setSub] = useState(false);
    const [cargando,setCargando] = useState(true);
    const navigate = useNavigate();

    const [cancelando, setCancelando] = useState(false);

    async function manejarCancelacion() {
        // 1. Verificación de seguridad
        if (!id_sub) {
            alert("No se encontró un ID de suscripción activo.");
            return;
        }

        const confirmar = confirm("¿Estás seguro de que quieres cancelar la suscripción? Mantendrás el acceso PRO hasta el fin del periodo actual.");
        if (!confirmar) return;

        setCancelando(true);

        try {
            // 2. Llamada a la Edge Function
            const { data: { session } } = await supabase.auth.getSession();
            
            const response = await fetch('https://kwpzjcosoqtongavbftm.supabase.co/functions/v1/cancelar_sub', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}` // Para que la función sepa quién llama
                },
                body: JSON.stringify({ 
                    id_sub: id_sub,
                    id_negocio: id.negocio 
                }),
            });

            const resultado = await response.json();

            if (response.ok) {
                alert("Suscripción cancelada con éxito. No se realizarán más cobros.");
                window.location.reload();
                // Opcional: Podés actualizar el estado local para que el botón desaparezca
                // setConfiguracion(prev => ({ ...prev, suscripto: false }));
            } else {
                throw new Error(resultado.error || "Error al procesar la cancelación");
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setCancelando(false);
        }
    }

    async function Guardar(e){
        e.preventDefault()
        console.log(id)
        const { error:errorPerfiles } = await supabase
        .from('perfiles')
        .update({ nombre: configuracion.nombre_usuario })
        .eq('id_auth', id.user)

        const { error:errorNegocios } = await supabase
        .from('negocios')
        .update({ nombre: configuracion.nombre_negocio })
        .eq('id', id.negocio)

        if(!errorNegocios && !errorPerfiles){
            alert('Guardado')
        }
        else{
            alert('Error al guardar')
        }
    }

    function manejarDatos(e){
        const {name,value} = e.target
        setConfiguracion((prev) => ({...prev,[name]:value}));
        console.log(configuracion);
    }

    useEffect(()=>{
        const comprobarSesion = async () => {
            const { data: {session}, error } = await supabase.auth.getSession();
            if (session){
                const { data:perfil, error:errorPerfil } = await supabase
                .from('perfiles')
                .select().eq('id_auth',session.user.id).single();
                if(!errorPerfil){
                    const { data:negocio, error:errornegocio } = await supabase
                    .from('negocios')
                    .select().eq('id',perfil.id_negocio).single();

                    if(!negocio.pagado){
                        navigate('/pagos')
                    }
                }
            }
            else{
                alert('Error: ',error)
            }
        }

        comprobarSesion();
    },[])

    useEffect(()=>{
        const comprobarSesion = async () => {
            const { data: {session}, error } = await supabase.auth.getSession();
            if (session){
                const { data:perfil, error:errorPerfil } = await supabase
                .from('perfiles')
                .select().eq('id_auth',session.user.id).single();
                if(!errorPerfil){
                    const { data:negocio, error:errornegocio } = await supabase
                    .from('negocios')
                    .select().eq('id',perfil.id_negocio).single();

                    setConfiguracion({
                        codigo_negocio:negocio.codigo,
                        nombre_negocio:negocio.nombre,
                        nombre_usuario:perfil.nombre,
                        email:perfil.email
                    });
                    setId({
                        user:session.user.id,
                        negocio:negocio.id
                    });
                    setDueno(perfil.dueno);
                    setSub(negocio.suscripto);
                    setId_sub(negocio.id_sub)
                    setCargando(false);
                }
            }
            else{
                alert('Error: ',error)
            }
        }

        comprobarSesion();
    },[])

    return(
        <>

        { cargando ?(
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-emerald-500 font-bold italic animate-pulse">Cargando configuración...</p>
            </div>
        ):(
            <div className="flex flex-col md:flex-row justify-center items-center p-6 md:p-10 gap-6">
                {dueno &&
                    <form className="bg-zinc-800/50 rounded-2xl p-4 md:p-10" onSubmit={(e) => Guardar(e)}>
                    <div className="flex flex-row justify-center items-center gap-3 p-4 rounded-2xl bg-zinc-950 italic text-2xl font-black"><span>Datos del</span><span className="text-emerald-500">Perfil</span></div>
                        
                        <div className="flex flex-col md:flex-row gap-3 rounded-2xl p-4 m-2 md:m-6 bg-zinc-950 items-center justify-center">
                            <label>Codigo de invitacion:</label>
                            <span>{configuracion.codigo_negocio}</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 rounded-2xl p-4 m-2 md:m-6 bg-zinc-950 items-center justify-center">
                            <label>Nombre del Negocio:</label>
                            <input name="nombre_negocio" onChange={(e) => manejarDatos(e)} defaultValue={configuracion.nombre_negocio} placeholder="Nombre de tu Negocio"/>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-3 rounded-2xl p-4 m-2 md:m-6 bg-zinc-950 items-center justify-center">
                            <label>Nombre de Usuario:</label>
                            <input name="nombre_usuario" onChange={(e) => manejarDatos(e)} defaultValue={configuracion.nombre_usuario} placeholder="Tu Nombre"/>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 rounded-2xl p-4 m-2 md:m-6 bg-zinc-950 items-center justify-center">
                            <label>Correo electronico de contacto:</label>
                            <input name="email" onChange={(e) => manejarDatos(e)} defaultValue={configuracion.email}/>
                        </div>

                        <button className="bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-900 transition-all text-center rounded-2xl p-2 text-2xl w-full mt-1 ">Guardar</button>

                    </form>  
                }
                {(dueno) &&
                    <div className="flex flex-col bg-zinc-800/50 rounded-2xl p-4 gap-6 items-center justify-center">
                        <span className="bg-zinc-950 w-fit p-4 rounded-2xl font-black italic text-3xl text-emerald-500">Suscripcion</span>
                        <button onClick={() => manejarCancelacion()} disabled={!sub} className="bg-indigo-500 shadow-md disabled:bg-indigo-500/30 disabled:hover:shadow-indigo-500/50 shadow-indigo-500/50 hover:bg-red-500 hover:shadow-red-500/90 hover:text-red-100 transition-all text-center rounded-2xl p-4 ">Cancelar Suscripcion</button>
                    </div>
                }
                {(!dueno) &&
                    <form className="bg-zinc-800/50 rounded-2xl p-10" onSubmit={(e) => Guardar(e)}>
                    <div className="flex flex-row justify-center items-center gap-3 p-4 rounded-2xl bg-zinc-950 italic text-2xl font-black"><span>Datos del</span><span className="text-emerald-500">Perfil</span></div>
                        
                        <div className="flex flex-row gap-3 rounded-2xl p-4 m-6 bg-zinc-950">
                            <label>Nombre de Usuario:</label>
                            <input name="nombre_usuario" onChange={(e) => manejarDatos(e)} defaultValue={configuracion.nombre_usuario} placeholder="Tu Nombre"/>
                        </div>
                        <div className="flex flex-row gap-3 rounded-2xl p-4 m-6 bg-zinc-950">
                            <label>Correo electronico de contacto:</label>
                            <input name="email" onChange={(e) => manejarDatos(e)} defaultValue={configuracion.email}/>
                        </div>

                        <button className="bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-900 transition-all text-center rounded-2xl p-2 text-2xl w-full mt-1 ">Guardar</button>

                    </form>
                }
            </div>
            )}     
        </>
    )

}
export default Configuracion