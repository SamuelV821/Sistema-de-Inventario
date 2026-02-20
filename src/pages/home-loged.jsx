import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

function Vender({productos,setProductos,idNegocioActual,idUser}){
    const [productosEncontrados,setProductosEncontrados] = useState([]);
    const [listaDeVenta,setListaDeVenta] = useState([]);

    
    function buscar(e){

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
        alert("¡Sin stock! No podés vender lo que no tenés, Guerrero.");
        return;
        }

        if(!listaDeVenta.some(item => item.id === p.id)){
            setListaDeVenta([...listaDeVenta,
                {id:p.id,
                producto:p.producto,
                cantidad:1,
                precio:p.precio_venta,
                precio_final:p.precio_venta

                } ]);
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
        <div className="bg-slate-400 min-h-60 flex flex-col rounded-2xl p-6 gap-6">
            <div className="flex flex-row h-6"><input type="text" className="border-1" onChange={(e) => buscar(e)}></input><button className="border-1">Buscar</button></div>
            {productosEncontrados.length > 0 && 
            <div className="min-h-4 bg-amber-200">
                {productosEncontrados.map((data,index) => (
                    <div key={index}>
                        <span>Producto: {data.producto} Precio: {data.precio_venta}</span>
                        <button onClick={() => agregarProducto(index)}>Agregar</button>
                    </div>
                ))}
            </div>}
            <div className="bg-white min-h-16 flex flex-col">
                {listaDeVenta.map((data,index)=>(
                    <div key={index}>
                    <span >Producto: {data.producto} Precio Unitario: {data.precio} Cantidad: </span>
                    <input type="number" min={1} step={1} 
                        onKeyDown={(e) => {if (e.key === '-' || e.key === '.') {
                        e.preventDefault();} else if(e.key ==='Enter'){e.currentTarget.blur()}}} defaultValue={data.cantidad} onBlur={(e)=> editarCantidad(e,index)}/>
                    <span> Precio Final: {data.precio_final}</span>
                    <button onClick={() => borrarProducto(index)}>x</button>
                    </div>
                ))}
            </div>
            <div>controles
                <button onClick={() => finalizarVenta()}>Finalizar Venta</button>
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
        }
    };
}, [idNegocioActual]);

        // Función auxiliar para traer los productos
        const obtenerProductosNuevamente = async () => {
            const { data } = await supabase.from('productos').select();
            if (data) setProductos(data);
        };



    return(
        <div>
            <Vender productos={productos} setProductos={setProductos} idNegocioActual={idNegocioActual} idUser={idUser}/>
           
        </div>
    )
}
export default HomeLoged