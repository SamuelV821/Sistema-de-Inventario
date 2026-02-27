import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Agregar({actualizarLista}){
    const [producto, setProducto] = useState({
          producto:'',
          descripcion:'',
          cantidad:0,
          precio_costo:0,
          precio_venta:0 ,
          id_negocio:'' 
    });

    const AgregarProductos = async () => {

        if(producto.producto === ''){
            alert('No puedes agregar un producto vacio');
            return;
        }

        const { error:errorInsert } = await supabase
        .from('productos')
        .insert([producto])



        if(!errorInsert){
            //console.log('Producto agregado')
            actualizarLista();
            setProducto({...producto,
                producto:'',
                descripcion:'',
                cantidad:0,
                precio_costo:0,
                precio_venta:0
            });

        }

        else{
            //console.log(error)
        }
    }

    function manejarDatos(e){
        const {name,value} = e.target;
        if(e.target.type=='number' && parseFloat(value)<0){
            e.target.value = producto[name];
            return;
        }
        const valorFinal = (e.target.type=='number' ? (parseFloat(value)||0) :value)
        setProducto({...producto, [name]:valorFinal});
    }
    
    

    useEffect(() => {

        async function cargarPerfil () {
            const { data: { session } } = await supabase.auth.getSession();

            const { data, error:errorSelect } = await supabase
            .from('perfiles')
            .select()
            .eq('id_auth',session.user.id).single()

            setProducto(prev => ({...prev,id_negocio: data.id_negocio}));
        }
        cargarPerfil();
    },[]);
    

    return(
        <div className="flex justify-center items-center sticky top-10">
            <div className="bg-zinc-800/50 rounded-2xl flex flex-col w-fit gap-4 p-4 items-center justify-center">

                <div className="flex flex-row justify-center items-center gap-3 italic font-black text-4xl"><span>Añadir</span><span className="text-emerald-500">Productos</span></div>

                <div className="flex flex-col gap-6 p-4 items-center justify-center text-slate-200 text-xl">

                    <div className="flex flex-col gap-2 p-4 justify-center items-center">
                    <span>Nombre del producto:</span>
                        <input className="bg-slate-900/50 border-1 text-center w-60" type="text" onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur()}}} name="producto" placeholder="producto" onChange={(e) => manejarDatos(e)} value={producto.producto} />
                        <span>Descripcion breve:</span>
                        <input className="bg-slate-900/50 border-1 text-center w-60" type="text" onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur()}}} name="descripcion" placeholder="descripcion" onChange={(e) => manejarDatos(e)} value={producto.descripcion} />
                    </div>

                    <div className="flex flex-col gap-2 p-4 justify-center items-center">
                        <span>Cantidad en Stock:</span>
                        <input className="bg-slate-900/50 border-1 text-center w-30" type="number" onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();}}} name="cantidad" placeholder="1" onBlur={(e) => manejarDatos(e)}/>
                        <span>Precio de costo: $</span>
                        <input className="bg-slate-900/50 border-1 text-center w-30" type="number" onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();}}} name="precio_costo" placeholder="" onBlur={(e) => manejarDatos(e)}/>
                        <span>Precio de venta: $</span>
                        <input className="bg-slate-900/50 border-1 text-center w-30" type="number" onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();}}} name="precio_venta" placeholder="" onBlur={(e) => manejarDatos(e)}/>
                    </div>
                </div>
                <button className="w-60 text-2xl font-black text-indigo-900 mt-5 bg-indigo-500 shadow-md shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:text-zinc-800 transition-all text-center rounded-2xl p-4 " onClick={() => AgregarProductos()}>Agregar</button>
            </div>
        </div>
    )
}


function Lista({productos , setProductos}){
    const [elementoEdicion,setElementoEdicion] = useState({
        id:null,
        tipo:''
    });
    const [productosEncontrados,setProductosEncontrados] = useState([]);
    
    useEffect(() => {
    setProductosEncontrados([...productos]);
    }, [productos]); 




    const borrarProducto = async (indice,error) => {
        const response = await supabase
        .from('productos')
        .delete()
        .eq('id', indice)

        if (!error){
            setProductos(prev => prev.filter(producto => producto.id !== indice));
        }
        

    }

    const editarProducto = async (e,indexEdicion) => {
        const {name,value} = e.target;
        const valorFinal = (e.target.type=='number' ? Math.max(0,(parseFloat(value)||0)) :value)

        const { error } = await supabase
        .from('productos')
        .update({ [name]:valorFinal })
        .eq('id', indexEdicion)

        if(!error){
            setProductos((prev) => 
                prev.map((p) => 
                p.id === indexEdicion ? { ...p, [name]: valorFinal } : p
                )
            );

            setElementoEdicion({
                id:null,
                tipo:''
            })
        }
        else{
            //console.log(error);
        }
    }

    function buscar(e){
        setProductosEncontrados(productos.filter(p =>
            p.producto.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value !== ""
        ));
        if(e.target.value === ''){
            setProductosEncontrados([...productos]);
        }
    }


    return(
        <>
            <div className="bg-zinc-950 rounded-2xl flex flex-row p-4 gap-4 justify-center items-center"><input type="text" className="bg-zinc-800/50 border-1 border-white/50 w-full p-1 pl-4 pr-4" onChange={(e) => buscar(e)} /><button className="bg-zinc-800/50 hover:bg-emerald-500/50 border-1 border-white/50 rounded-2xl p-1 pl-4 pr-4">Buscar</button></div>
        {productosEncontrados?.map((data) => (
            <div className="bg-zinc-800/50 rounded-2xl flex flex-col md:grid md:grid-cols-4 md:grid-rows-4 justify-center items-center p-4 md:p-5 gap-4 md:gap-5 m-6" key={data.id}>

                <div className="flex flex-row gap-3 md:text-xl md:col-span-4 truncate"><span>Producto: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'producto') ? 
                <input className="bg-zinc-950 w-20 h-fit" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="text" autoFocus name="producto" defaultValue={data.producto} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'producto'})}} >{data.producto}</span>
                }</div>

                <div className="flex flex-row gap-3 md:text-xl md:col-span-4 truncate"><span>Descripcion: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'descripcion') ? 
                <input className="bg-zinc-950 w-20 h-fit" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="text" autoFocus name="descripcion" defaultValue={data.descripcion} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'descripcion'})}} >{data.descripcion}</span>
                }</div>

                <div className="flex flex-row gap-3 md:text-xl md:col-span-4"><span>Stock: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'cantidad') ? 
                <input className="w-20 h-fit" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();} }} type="number" autoFocus name="cantidad" defaultValue={data.cantidad} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'cantidad'})}} >{data.cantidad}</span>
                }</div>

                <div className="flex flex-row gap-1 md:text-xl md:col-span-2"><span>Precio Costo: $</span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'precio_costo') ? 
                <input className="w-20 h-fit" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();} }} type="number" autoFocus name="precio_costo" defaultValue={data.precio_costo} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'precio_costo'})}} >{data.precio_costo}</span>
                }</div>

                <div className="flex flex-row gap-1 md:text-xl md:col-span-2"><span>Precio Venta: $</span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'precio_venta') ? 
                <input className="w-20 h-fit" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()} else if (e.key === '-' || e.key === '.' || e.key === ',') {e.preventDefault();} }} type="number" autoFocus name="precio_venta" defaultValue={data.precio_venta} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'precio_venta'})}} >{data.precio_venta}</span>
                }</div>

                <div className="flex justify-end md:col-span-4"><button className="text-2xl md:text-4xl" onClick={() => borrarProducto(data.id)}>⛔</button></div>
                
            </div>
        ))}
        </>
    )
}

export function Inventario(){

    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const [id_negocio,setId_negocio] = useState('');

    const TraerProductos = async () => {
        const { data, error } = await supabase
        .from('productos')
        .select()

        if(!error){
            setProductos(data)
            //console.log('Lista cargada');
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
        TraerProductos();

    },[])
    
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-10 md:p-1 gap-6">

            <div className="md:col-start-8 md:col-end-11 md:row-start-1 md:row-end-2 p-0"><Agregar actualizarLista={TraerProductos}/></div>
            <div className="md:col-start-1 md:col-end-8 md:row-start-1 md:row-end-2"><Lista productos={productos} setProductos={setProductos}/></div>

        </div>
    )
}