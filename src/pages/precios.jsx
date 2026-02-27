import { supabase } from "../supabaseClient"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Precios(){
    const navigate = useNavigate();
    const [productos,setProductos] = useState([]);
    const [productosEncontrados,setProductosEncontrados] = useState([]);

    useEffect(() => {
    setProductosEncontrados([...productos]);
    }, [productos]); 

    function buscar(e){
        setProductosEncontrados(productos.filter(p =>
            p.producto.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value !== ""
        ));
        if(e.target.value === ''){
            setProductosEncontrados([...productos]);
        }
    }

    const pedirPrecios = async () => {
        const { data, error } = await supabase
        .from('productos')
        .select()

        if(!error){
            setProductos(data);
            //console.log('Lista de precios recibida')
            setProductos(data);
        }

        else{
            //console.log('Error:',error);
        }
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
        <div>
            <div className="bg-zinc-950 rounded-2xl flex flex-row p-4 gap-4 justify-center items-center"><input type="text" className="bg-zinc-800/50 border-1 border-white/50 w-full p-1 pl-4 pr-4" onChange={(e) => buscar(e)} /><button className="bg-zinc-800/50 hover:bg-emerald-500/50 border-1 border-white/50 rounded-2xl p-1 pl-4 pr-4">Buscar</button></div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-8 gap-6">
                
            {productosEncontrados?.map((data) => (
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-emerald-500/50 transition-all duration-300" key={data.id}>
                    <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{data.producto}</span>
                    <span className="text-emerald-500 text-3xl font-black italic tracking-tighter">
                        ${data.precio_venta.toLocaleString('es-AR')}
                    </span>
                </div>
            ))}

            </div>
        </div>
    )
}

export default Precios