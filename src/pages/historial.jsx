import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Historial() {
    const [facturas, setFacturas] = useState([]);
    const [ventas, setVentas] = useState([]);
    const navigate = useNavigate();
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000; 
    const fechaLocal = new Date(hoy - offset).toISOString().substring(0,10)
    const [date,setDate] = useState(fechaLocal);

    async function cargarHistorial(fechaReferencia) {

        const { data:dataFacturas, error:errorFacturas } = await supabase
        .from('facturas')
        .select().order('created_at', { ascending: false })

        const { data:dataVentas, error:errorVentas } = await supabase
        .from('ventas')
        .select()

        if(!errorFacturas && !errorVentas){
            setFacturas(dataFacturas.filter(f => f.created_at.substring(0,7) === fechaReferencia ));
            setVentas(dataVentas.filter(f => f.created_at.substring(0,7) === fechaReferencia ));
        }



        
    }

    async function buscarFecha(e){

        const fechaSeleccionada = e.target.value;

        if(!(fechaSeleccionada === '')){
            setDate(fechaSeleccionada);
            if(fechaSeleccionada.substring(0,7) !== date.substring(0,7)){
                cargarHistorial(fechaSeleccionada.substring(0,7));
            }
        }

    }

    useEffect(() => {
        const comprobarSesion = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/');
            } else {
                const { data: perfiles, error } = await supabase
                    .from('perfiles')
                    .select()
                    .eq('id_auth', session.user.id);

                if (!error && perfiles.length > 0) {
                    if (perfiles[0].id_negocio === null) {
                        navigate('/');
                    } 
                }
            }
        };
        cargarHistorial(date.substring(0,7));
        comprobarSesion();

    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <div className="bg-zinc-800/50 rounded-2xl p-4 flex flex-row gap-8 w-fit justify-center items-center">
            <span className="font-black italic">Filtrar por fecha</span>
                <input className="bg-white/80 text-xl text-black p-2 rounded-2xl" type="date" value={date} onChange={(e) => buscarFecha(e)}/>
            </div>
            {facturas.filter(f => f.created_at.substring(0,10) === date).map((fact) => (
                <div className="bg-zinc-800/50 rounded-2xl p-6 flex flex-col gap-8 justify-center w-full">
                    <div className="bg-indigo-500/50 rounded-2xl p-4">
                        <div className="flex flex-row justify-between items-center">
                            <h1>Venta registrada</h1>
                            <p>Fecha: {new Date(fact.created_at).toLocaleDateString('es-AR')}</p>
                        </div>
                        <span>Id: {fact.id}</span>
                    </div>

                    {ventas.filter((v) => v.id_factura === fact.id).map((vent) => (
                        <div className="flex flex-row gap-6 p-6 justify-between items-center">
                            <span>Producto: {vent.producto}</span><span>Cantidad: {vent.cantidad}</span><span>Precio: $ {vent.precio}</span><span>Precio total: $ {vent.precio_final}</span>
                        </div>
                    ))}

                    <div className="flex flex-row justify-between items-center"><span>Metodo de pago: {fact.metodo_pago}</span><span className="text-emerald-500 text-3xl font-black italic">Total: $ {fact.total}</span></div>

                </div>
            ))}
        </div>
    );
}

export default Historial;