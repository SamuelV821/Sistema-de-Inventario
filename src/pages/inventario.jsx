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
        <div className="grid grid-cols-2 gap-10 p-10">
            <input className="bg-slate-400 border-1 text-center" type="text" name="producto" placeholder="" onChange={(e) => manejarDatos(e)} value={producto.producto} />
            <input className="bg-slate-400 border-1 text-center" type="text" name="descripcion" placeholder="" onChange={(e) => manejarDatos(e)} value={producto.descripcion} />
            <input className="bg-slate-400 border-1 text-center" type="number" name="cantidad" placeholder="" onChange={(e) => manejarDatos(e)} value={producto.cantidad} />
            <input className="bg-slate-400 border-1 text-center" type="number" name="precio_costo" placeholder="" onChange={(e) => manejarDatos(e)} value={producto.precio_costo} />
            <input className="bg-slate-400 border-1 text-center" type="number" name="precio_venta" placeholder="" onChange={(e) => manejarDatos(e)} value={producto.precio_venta} />
            <button className="bg-amber-300 border-1 text-center" onClick={() => AgregarProductos()}>Agregar</button>
        </div>
    )
}


function Lista({productos , setProductos}){
    const [elementoEdicion,setElementoEdicion] = useState({
        id:null,
        tipo:''
    });




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


    return(
        <>
        {productos?.map((data) => (
            <div className="flex flex-col" key={data.id}>
                <span>Producto: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'producto') ? 
                <input className="bg-slate-400" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="text" autoFocus name="producto" defaultValue={data.producto} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'producto'})}} >{data.producto}</span>
                }

                <span>Descripcion: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'descripcion') ? 
                <input className="bg-slate-400" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="text" autoFocus name="descripcion" defaultValue={data.descripcion} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'descripcion'})}} >{data.descripcion}</span>
                }

                <span>Stock: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'cantidad') ? 
                <input className="bg-slate-400" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="number" autoFocus name="cantidad" defaultValue={data.cantidad} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'cantidad'})}} >{data.cantidad}</span>
                }

                <span>Precio Costo: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'precio_costo') ? 
                <input className="bg-slate-400" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="number" autoFocus name="precio_costo" defaultValue={data.precio_costo} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'precio_costo'})}} >{data.precio_costo}</span>
                }

                <span>Precio Venta: </span>
                {(elementoEdicion.id === data.id) && (elementoEdicion.tipo === 'precio_venta') ? 
                <input className="bg-slate-400" onKeyDown = {(e) => {if(e.key === 'Enter'){e.target.blur()}}} type="number" autoFocus name="precio_venta" defaultValue={data.precio_venta} onBlur={(e) => editarProducto(e,data.id)}/>
                :
                <span onClick={() =>{if (elementoEdicion.id !== null)
                     return; setElementoEdicion({id:data.id,tipo:'precio_venta'})}} >{data.precio_venta}</span>
                }
                
            <button onClick={() => borrarProducto(data.id)}>x</button>
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
        <>
        <Agregar actualizarLista={TraerProductos}/>
        <Lista productos={productos} setProductos={setProductos}/>

        </>
    )
}