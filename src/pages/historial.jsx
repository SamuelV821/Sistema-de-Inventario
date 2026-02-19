import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Historial() {
    const [facturas, setFacturas] = useState([]);
    const [ventas, setVentas] = useState([]);
    const navigate = useNavigate();
    const [date,setDate] = useState(new Date().toISOString().substring(0,7));

    async function cargarHistorial() {

        const { data:dataFacturas, error:errorFacturas } = await supabase
        .from('facturas')
        .select()

        const { data:dataVentas, error:errorVentas } = await supabase
        .from('ventas')
        .select()

        if(!errorFacturas && !errorVentas){
            setFacturas(dataFacturas.filter(f => f.created_at.substring(0,7) === date ));
            setVentas(dataVentas.filter(f => f.created_at.substring(0,7) === date ));
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
        cargarHistorial();
        comprobarSesion();

    }, []);

    return (
        <div>
            <div>
                <input type="date"/>
            </div>
            {facturas.map((fact) => (
                <div>
                    <h1>Factura</h1>
                    <p>Fecha:{fact.created_at}</p>

                    {ventas.filter((v) => v.id_factura === fact.id).map((vent) => (
                        <div>
                            <span>Producto:{vent.producto}         Cantidad:{vent.cantidad}           Precio:{vent.precio}         Precio total:{vent.precio_final}</span>

                        </div>
                    ))}

                    <p>Total:{fact.total}                   Metodo de pago:{fact.metodo_pago}</p>

                </div>
            ))}
        </div>
    );
}

export default Historial;