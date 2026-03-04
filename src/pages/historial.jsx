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

    // Calculamos el resumen basado en el filtro de fecha actual
    const facturasDelDia = facturas.filter(f => {
        const fechaFacturaLocal = new Date(f.created_at).toLocaleDateString('en-CA');
        return fechaFacturaLocal === date;
    });

    // Ejemplo de cómo deberías estar calculando esto
const totalDineroDia = facturasDelDia
    .filter(v => v.metodo_pago !== 'Libreta/Fiado')
    .reduce((acc, v) => acc + v.total, 0);

const totalLibretaDia = facturasDelDia
    .filter(v => v.metodo_pago === 'Libreta/Fiado')
    .reduce((acc, v) => acc + v.total, 0);
    const cantidadVentasDia = facturasDelDia.length;

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            
            <div className="bg-zinc-800/50 rounded-2xl p-4 flex flex-row gap-8 w-fit justify-center items-center">
            <span className="font-black italic hidden md:block">Filtrar por fecha</span>
                <input className="bg-white/80 text-xl text-black p-2 rounded-2xl" type="date" value={date} onChange={(e) => buscarFecha(e)}/>
            </div>

            {/* Resumen del Día */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-end">
                    <span className="text-zinc-400 text-xs uppercase tracking-widest">Ventas del Dia</span>
                    <span className="text-white text-3xl font-black">{cantidadVentasDia}</span>
                </div>

                <div className="flex flex-col items-end border-t p-2 md:border-l border-white/10 pl-8">
                    <span className="text-emerald-500/80 text-xs uppercase tracking-widest">Total recaudado</span>
                    <span className="text-emerald-500 text-3xl font-black italic">
                        $ {totalDineroDia.toLocaleString('es-AR')}
                    </span>
                </div>

                {/* BLOQUE AMARILLO: LIBRETA/FIADO */}
                <div className="flex flex-col items-end border-t p-2 md:border-l border-white/10 pl-8">
                    <span className="text-amber-400/80 text-xs uppercase tracking-widest">En Libreta (Fiado)</span>
                    <span className="text-amber-400 text-3xl font-black italic">
                        $ {totalLibretaDia.toLocaleString('es-AR')}
                    </span>
                </div>
            </div>
                        
            {facturas.filter(f => {
                const fechaFacturaUTC = new Date(f.created_at);
                // Extraemos solo la parte YYYY-MM-DD en formato local
                const fechaFacturaLocal = fechaFacturaUTC.toLocaleDateString('en-CA'); // en-CA devuelve YYYY-MM-DD
                
                return fechaFacturaLocal === date;

            }).map((fact) => (
                <div key={fact.id} className="bg-zinc-800/50 rounded-2xl p-1 md:p-6 flex flex-col gap-4 justify-center w-full border-white/5 border-1">
                    <div className="bg-indigo-500/50 rounded-2xl p-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <h1>Venta registrada</h1>
                            <p>Fecha: {new Date(fact.created_at).toLocaleDateString('es-AR')}</p>
                        </div>
                        <span className="hidden md:block">Id: {fact.id}</span>
                    </div>

                    {ventas.filter((v) => v.id_factura === fact.id).map((vent) => (
                        <div className="flex flex-col md:flex-row gap-6 p-6 justify-between items-center border-white/10 border-1 rounded-2xl">
                            <span>Producto: {vent.producto}</span><span>Cantidad: {vent.cantidad}</span><span>Precio: $ {vent.precio}</span><span>Precio total: $ {vent.precio_final}</span>
                        </div>
                    ))}

                    <div className="flex flex-row justify-between items-center mt-10 border-white/10 border-t-2 p-4 "><span>Metodo de pago: {fact.metodo_pago}</span><span className="text-emerald-500 text-1xl md:text-3xl font-black italic border-l-2 border-white/10 p-4">Total: $ {fact.total}</span></div>

                </div>
            ))}
        </div>
    );
}

export default Historial;