import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // TAREA 1: EL PORTERO (CORS)
  // Sin esto, el navegador te tira el error de red/404 que vimos antes.
  const headers = {
    "Access-Control-Allow-Origin": "*", // Acepto pedidos de cualquier lado
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  // Si el navegador solo viene a preguntar (OPTIONS), le decimos que está todo bien.
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    // TAREA 2: ABRIR EL PAQUETE
    const { token, email } = await req.json();

    // TAREA 3: TRÁMITE CON MERCADO PAGO
    // Usamos el TOKEN de la tarjeta y el PLAN_ID que creaste en el Dashboard de MP.
    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`, // Tu llave secreta
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preapproval_plan_id: "f283e9753db24deaa5970a6538ff6b35", 
        reason: "Suscripcion ClickVenta",
        payer_email: email,
        card_token_id: token,
        status: "authorized"
      }),
    });

    const data = await mpResponse.json();

    // TAREA 4: RESPONDER A REACT
    return new Response(JSON.stringify(data), { 
      status: mpResponse.status, 
      headers 
    });

  } catch (error) {
    // Si algo explota, avisamos qué pasó
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers 
    });
  }
})