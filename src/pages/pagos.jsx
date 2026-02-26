import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom"

// 1. INICIALIZACIÓN: Conectamos tu App con Mercado Pago
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

const Pagos = () => {
  const navigate = useNavigate();
  const [id,setId] = useState();
  const initialization = {
    amount: 100, // Debe coincidir con el monto del Plan
    // Agregamos esto para que el SDK sepa que es una tarjeta de prueba
    type: 'recurring', 
  };

  // 2. LA FUNCIÓN "CARTERO": Envía los datos a tu servidor (Supabase)
  const onSubmit = async (formData) => {
    const { token, payer } = formData;
    //console.log("Intentando pagar. ID de negocio actual:", id);

      if (!id) {
        alert("Error: No se detectó tu ID de negocio. Por favor, recarga la página.");
        return;
      }

    try {
      // URL de tu función en Supabase (aseguramos que no haya espacios)
      const functionURL = 'https://kwpzjcosoqtongavbftm.supabase.co/functions/v1/suscripcion-clickventa'.trim();

      const response = await fetch(functionURL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY 
        },
        body: JSON.stringify({
          token: token,
          email: payer.email,
          idNegocio: id,
        }),
      });

      // 3. DIAGNÓSTICO DE RESPUESTA
      if (!response.ok) {
        // Leemos los detalles que configuramos en la Edge Function
        const mensajeDeError = "No se pudo procesar el pago, revise los datos de su tarjeta";
        console.error("Error de Mercado Pago:", resultado);
        
        // El alert ahora dirá "Saldo insuficiente" o lo que diga MP
        alert(`⚠️ Atención: ${mensajeDeError}`);
        return; 
      }

      const resultado = await response.json();
      //console.log("Respuesta de Mercado Pago:", resultado);

      if (resultado.status === "authorized" || resultado.status === "active") {
        alert("¡Cobro exitoso! Ya eres ClickVenta Pro.");
        window.location.reload();
      } else {
        alert("Mercado Pago rechazó el pago. Verifica los datos de la tarjeta.");
        window.location.reload();
      }

    } catch (err) {
      console.error("Error crítico en el proceso:", err);
      alert("No se pudo realizar el pago, revise sus datos y vuelva a intentar.");
      window.location.reload();
    }
  };

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

                    if(negocio.pagado){
                        navigate('/home')
                    }
                }
            }
            else{
                alert('Error: ',error)
            }
        }

        comprobarSesion();
    },[])

  useEffect((()=>{
    const comprobarSesion = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if(session){
                  //console.log('sesion encontrada')
                  const { data: idEncontrada, error:errorSelect } = await supabase
                  .from('perfiles')
                  .select('id_negocio').eq('id_auth',session.user.id).single();
                  if(!errorSelect){
                    //console.log('id encontrada:',idEncontrada.id_negocio)
                    //console.log(idEncontrada)
                    setId(idEncontrada.id_negocio)
                  }
                }
                else{
                  //console.log('no se encontro una sesion')
                }
    }
    comprobarSesion();
}),[]);

  return (
    <div className="min-h-screen bg-[#0b0e11] flex flex-col items-center justify-center md:p-4 text-white">
      <div className="w-full max-w-[450px] bg-[#181a1f] p-2 md:p-8 rounded-2xl border border-[#2b2f36] shadow-2xl">
        
        <div className="text-center mb-8 ">
          <img 
            src="/img/MP.png" 
            alt="Mercado Pago" 
            className="h-5 hover:grayscale-0 transition-all m-2"
          />
        <h1 className="text-2xl font-bold mb-1">Finalizar Suscripción</h1>
        <p className="text-zinc-400 text-sm italic">Plan Mensual ClickVenta</p>
      </div>

      <div className="bg-zinc-950/50 rounded-xl p-4 mb-6 border border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-zinc-400 text-xs">Monto a pagar</span>
          <span className="text-emerald-500 font-bold text-lg">$25.000 /mes</span>
        </div>
        <div className="text-[10px] text-zinc-500 leading-tight">
          El cobro se realizará de forma automática cada mes. Podés cancelar cuando quieras desde tu panel.
        </div>
      </div>

        {/* El "Cajero" de Mercado Pago */}
        {id &&
        <CardPayment
          initialization={initialization}
          onSubmit={onSubmit}
          customization={{
            visual: {
              style: { theme: 'dark' }
            },
            //AGREGÁ ESTO PARA FORZAR LA VALIDACIÓN COMPLETA
            paymentMethods: {
              minInstallments: 1,
              maxInstallments: 1,
            },
          }}
        />
        }

        <div className="mt-8 pt-6 border-t border-[#2b2f36] flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 opacity-70">
          <span className="text-xs text-zinc-400">Procesado por</span>
          {/* SVG Oficial de Mercado Pago (o una imagen) */}
          <img 
            src="/img/MP.png" 
            alt="Mercado Pago" 
            className="h-5 hover:grayscale-0 transition-all"
          />
        </div>

          <p className="mt-6 text-xs text-zinc-500 text-center max-w-[300px]">
      Tus datos están protegidos por encriptación de grado bancario. ClickVenta no almacena los datos de tu tarjeta.
    </p>
        
      </div>
        
      </div>
    </div>
  );
};

export default Pagos;