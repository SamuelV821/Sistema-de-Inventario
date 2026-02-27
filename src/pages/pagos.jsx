import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

const Pagos = () => {
  const navigate = useNavigate();
  const [id, setId] = useState();
  
  const initialization = {
    amount: 25000, 
  };

  const onSubmit = async (formData) => {
    // 1. EXTRAEMOS LA INFO QUE NARANJA NECESITA
    const { token, payer, payment_method_id, issuer_id } = formData;

    if (!id) {
      alert("Error: No se detectó tu ID de negocio. Por favor, recarga la página.");
      return;
    }

    try {
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
          payment_method_id: payment_method_id, // Vital para Naranja
          issuer_id: issuer_id // Vital para Naranja
        }),
      });

      // 2. DIAGNÓSTICO CORRECTO (Leemos el JSON antes del IF)
      const resultado = await response.json();

      if (!response.ok) {
        console.error("Error detallado del Servidor/MP:", resultado);
        alert(`⚠️ Atención: Mercado Pago rechazó la tarjeta. Verifique los datos o use otra tarjeta.`);
        return; 
      }

      if (resultado.status === "authorized" || resultado.status === "active" || resultado.status === "approved") {
        alert("¡Cobro exitoso! Ya eres ClickVenta Pro.");
        navigate('/home'); // Mejor usar navigate que window.location.reload()
      } else {
        alert("Mercado Pago rechazó el pago. Verifica los datos de la tarjeta.");
      }

    } catch (err) {
      console.error("Error crítico en el proceso:", err);
      alert("No se pudo realizar el pago, revise sus datos y vuelva a intentar.");
    }
  };

  // 3. CURAMOS LA TAQUICARDIA: Un solo useEffect para todo
  useEffect(() => {
    const comprobarSesionYNegocio = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        const { data: perfil, error: errorPerfil } = await supabase
          .from('perfiles')
          .select('id_negocio')
          .eq('id_auth', session.user.id)
          .single();

        if (!errorPerfil && perfil) {
          setId(perfil.id_negocio); // Guardamos el ID para el Brick

          // Verificamos si ya pagó
          const { data: negocio } = await supabase
            .from('negocios')
            .select('pagado')
            .eq('id', perfil.id_negocio)
            .single();

          if (negocio && negocio.pagado) {
            navigate('/home');
          }
        }
      } else if (error) {
        console.error('Error de sesión: ', error);
      }
    };

    comprobarSesionYNegocio();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0b0e11] flex flex-col items-center justify-center md:p-4 text-white">
      
      <div className="w-full max-w-[450px] bg-[#181a1f] p-2 md:p-8 rounded-2xl border border-[#2b2f36] shadow-2xl">
        
        <div className="text-center mb-8 ">
          <img src="/img/MP.png" alt="Mercado Pago" className="h-5 hover:grayscale-0 transition-all m-2 mx-auto"/>
          <h1 className="text-2xl font-bold mb-1">Finalizar Suscripción</h1>
          <p className="text-zinc-400 text-sm italic">Plan Mensual ClickVenta</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div className="flex flex-col">
                <span className="text-amber-500 font-bold text-sm">Información sobre tarjetas</span>
                <span className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Por políticas de seguridad de Mercado Pago para débitos automáticos, <strong>solo se aceptan tarjetas Visa, Mastercard</strong>. Las tarjetas locales (como Naranja Clásica) podrían ser rechazadas.
                </span>
            </div>
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

        {id && (
          <CardPayment
            initialization={initialization}
            onSubmit={onSubmit}
            customization={{
              visual: { style: { theme: 'dark' } },
              paymentMethods: {
                minInstallments: 1,
                maxInstallments: 1,
              },
            }}
          />
        )}

        <div className="mt-8 pt-6 border-t border-[#2b2f36] flex flex-col items-center gap-4">
          <p className="mt-2 text-xs text-zinc-500 text-center max-w-[300px]">
            Tus datos están protegidos por encriptación de grado bancario. ClickVenta no almacena los datos de tu tarjeta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pagos;