import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

function Vender({productos,setProductos,idNegocioActual,idUser}){
    const [productosEncontrados,setProductosEncontrados] = useState([]);
    const [listaDeVenta,setListaDeVenta] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState('')

    
    function buscar(e){
        setTextoBusqueda(e.target.value);
        setProductosEncontrados(productos.filter(p =>
            p.producto.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value !== ""
        ));
        if(e.target.value === ''){
            setProductosEncontrados([]);
        }
    }

    function agregarProducto(index){
        const p = productosEncontrados[index];

        if (p.cantidad <= 0) {
        alert("¡Sin stock! No podés vender lo que no tenés.");
        return;
        }

        if(!listaDeVenta.some(item => item.id === p.id)){
            setListaDeVenta([...listaDeVenta,
                {id:p.id,
                producto:p.producto,
                cantidad:1,
                precio:p.precio_venta,
                precio_final:p.precio_venta

            }]);
            setTextoBusqueda('');
            setProductosEncontrados([]);
        }
    }

    function borrarProducto(index){
        setListaDeVenta(prev => prev.filter((_, i) => i !== index));
    }

    function editarCantidad(e,index){
        const cant = (parseFloat(e.target.value));
        const productoOriginal = productos.find(p => p.id === listaDeVenta[index].id);
        const stockDisponible = productoOriginal?.cantidad || 0;

        if(!isNaN(cant)){

            if(cant > stockDisponible){
                alert('Stock insuficiente');
                e.target.value = listaDeVenta[index].cantidad;
                return;
            }

            else if(cant < 1){
                e.target.value = listaDeVenta[index].cantidad;
                return;
            }

            setListaDeVenta(prev => prev.map((item,id)=>{
            if(id === index){
                return{...item,
                    cantidad:cant,
                    precio_final:(cant*item.precio)

                }
            }
            return(item);
            }));
        }
        else{
            e.target.value = listaDeVenta[index].cantidad;
        }
        
    }

   const finalizarVenta = async () => {
    const totalVenta = listaDeVenta.reduce((acc, el) => acc + el.precio_final, 0);

    if(listaDeVenta.length === 0){
        //console.log('Agrega un producto')
        return;
    }
    
    // 1. Insertamos la cabecera de la factura
    const { data: venta, error: errorVenta } = await supabase
        .from('facturas')
        .insert([{ 
            total: totalVenta,
            id_negocio: idNegocioActual,
            metodo_pago:'Efectivo',
            id_usuario: idUser
        }])
        .select();

    if (!errorVenta) {
        // 2. Preparamos los renglones de la factura para insertarlos todos juntos
        const detalles = listaDeVenta.map(item => ({
            id_factura: venta[0].id,
            id_producto: item.id,
            cantidad: item.cantidad,
            precio: item.precio,
            precio_final: item.precio_final,
            producto: item.producto
        }));

        await supabase.from('ventas').insert(detalles);
        
        // 3. ¡Misión cumplida! Limpiamos todo
        alert("Factura generada con éxito");
        setListaDeVenta([]);
        // ... después de insertar los detalles ...

        // Llamamos a nuestra función personalizada de Supabase
        const { error: errorStock } = await supabase.rpc('descontar_stock_masivo', {
            productos_venda: listaDeVenta // Le mandamos la lista entera de un golpe
        });

        if (errorStock) {
            console.error("Error actualizando stock:", errorStock);
        } else {
            alert("¡Venta exitosa y stock actualizado en un solo viaje!");
            setListaDeVenta([]);
        }
    }

    
};

    
    

    
    

    return(
        <div className="bg-zinc-800/50 flex flex-col rounded-2xl p-2 md:p-6 gap-8 md:gap-10">
            <div className="relative flex flex-col gap-4">
                <div className="bg-zinc-950 rounded-2xl flex flex-row p-4 gap-4 justify-center items-center"><input type="text" className="bg-zinc-800/50 border-1 border-white/50 w-full p-1 pl-4 pr-4" onChange={(e) => buscar(e)} value={textoBusqueda}></input><button className="bg-zinc-800/50 hover:bg-emerald-500/50 border-1 border-white/50 rounded-2xl p-1 pl-4 pr-4">Buscar</button></div>
                {productosEncontrados.length > 0 && 
                    <div className="bg-indigo-950/97 p-6 rounded-2xl mx-h-80 max-h-130 md overflow-y-scroll overflow-x-hidden absolute top-full mt-3 w-full flex flex-col gap-4 z-50">
                        {productosEncontrados.map((data,index) => (
                            <div className="bg-indigo-500/30 flex flex-col md:flex-row gap-6 p-4 justify-between items-center rounded-3xl" key={index}>
                                <span>Producto: {data.producto}</span>
                                <span>Precio: {data.precio_venta}</span>
                                <span>Stock: {data.cantidad}</span>
                                <button className="bg-emerald-500 rounded-3xl p-2 text-zinc-900 hover:bg-emerald-500/70 hover:text-zinc-950/50" onClick={() => agregarProducto(index)}>Agregar</button>
                            </div>
                        ))}
                    </div>
                }
            </div>
            
            <div className="bg-zinc-950 min-h-20 flex h-60 md:h-120 overflow-y-scroll overflow-x-hidden flex-col rounded-2xl p-6 gap-6">
                {listaDeVenta.map((data,index)=>(
                    <div className="flex flex-col md:flex-row  p-1 md:p-6 gap-2 md:gap-6 justify-between items-center bg-slate-500/50 rounded-2xl" key={index}>
                    <span>Producto: {data.producto}</span>
                    <span>Precio Unitario: {data.precio}</span>
                    <div className="flex flex-row gap-2 items-center"><span>Cantidad: </span>
                        <input className="w-20 border-1 border-white/50 pl-2 pr-2 p-1" type="number" min={1} step={1} 
                            onKeyDown={(e) => {if (e.key === '-' || e.key === '.') {
                            e.preventDefault();} else if(e.key ==='Enter'){e.currentTarget.blur()}}} defaultValue={data.cantidad} onBlur={(e)=> editarCantidad(e,index)}/>
                            </div>
                        <span> Precio Final: {data.precio_final}</span>
                        <button className="text-3x1 md:text-4xl" onClick={() => borrarProducto(index)}>⛔</button>
                    </div>
                ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-row gap-2 items-center">
                    <label className="text-white text-sm">Método de Pago</label>
                        <select className="bg-zinc-800 w-fit text-white p-1 md:p-3 rounded-xl border border-white/10 outline-none focus:ring-2 ring-indigo-500">
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="tarjeta">Tarjeta de Débito</option>
                            <option value="tarjeta">Tarjeta de Credito</option>
                        </select>
                </div>
                    <button className="bg-emerald-500/80 rounded-2xl p-2 md:p-4 text-1xl md:text-2xl border-slate-300/50 border-1 text-zinc-900 hover:text-zinc-800/80 hover:bg-emerald-500/50" onClick={() => finalizarVenta()}>Finalizar Venta</button>
            </div>
        </div>
    )
}



function HomeLoged(){
    const navigate = useNavigate();
    const [productos,setProductos] = useState([]);
    const [idNegocioActual, setIdNegocioActual] = useState('')
    const [idUser,setIdUser] = useState ('')
    

    useEffect(() => {
        const comprobarSesion = async () => {
            const { data: { session } } = await supabase.auth.getSession();
                
            // Si hay sesión activa, lo mandamos al panel de control
            if (!session) {
                navigate('/');

            }
            else{
                setIdUser(session.user.id)
                const { data:perfiles, error } = await supabase
                .from('perfiles')
                .select().eq('id_auth',session.user.id);

                if(!error){
                    if(perfiles[0].id_negocio === null){
                        navigate('/afiliarse')
                    }
                    else{
                        setIdNegocioActual(perfiles[0].id_negocio);
                    }
                    

                    const { data:productosCargados, error:errorSelect } = await supabase
                    .from('productos')
                    .select()

                    if(!errorSelect){
                        setProductos(productosCargados);
                    }
                }
            }

            
        }

        comprobarSesion();

        // Si todavía no tenemos el ID del negocio, no nos suscribimos
        if (!idNegocioActual) return;

        //console.log("Iniciando suscripción para negocio:", idNegocioActual);

        const canal = supabase
        .channel(`cambios-${idNegocioActual}`) // Nombre único por negocio
        .on(
            'postgres_changes',
            { 
                event: '*', 
                schema: 'public', 
                table: 'productos',
                filter: `id_negocio=eq.${idNegocioActual}` // ¡Optimización! Solo escuchá lo tuyo
            },
            (payload) => {
                //console.log('¡Cambio detectado en productos!', payload);
                obtenerProductosNuevamente();
            }
        )
        .subscribe((status) => {
            //console.log("Estado real de suscripción:", status);
        });

        return () => {
        if (canal) {
            //console.log("Cerrando canal de forma segura...");
            supabase.removeChannel(canal);
        }};
        
    }, [idNegocioActual]);

        // Función auxiliar para traer los productos
        const obtenerProductosNuevamente = async () => {
            const { data } = await supabase.from('productos').select();
            if (data) setProductos(data);
        };



    return(
        <div className="p-1 md:p-4">
            <Vender productos={productos} setProductos={setProductos} idNegocioActual={idNegocioActual} idUser={idUser}/>
           
        </div>
    )
}
export default HomeLoged