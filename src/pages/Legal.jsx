import { useLocation } from "react-router-dom";

export function Legal() {
    const { pathname } = useLocation();
    const isTerms = pathname.includes("terminos");

    return (
        <div className="bg-zinc-950 min-h-screen p-4 md:p-8 text-slate-300 w-full flex justify-center">
            <div className="max-w-4xl w-full bg-zinc-900/50 p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
                
                <h1 className="text-3xl md:text-4xl font-black text-emerald-500 italic mb-8 border-b border-white/10 pb-4">
                    {isTerms ? "Términos y Condiciones de Uso" : "Política de Privacidad y Tratamiento de Datos"}
                </h1>
                
                <div className="space-y-8 text-sm md:text-base leading-relaxed text-slate-400">
                    {isTerms ? (
                        <>
                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">1. Objeto y Aceptación</h2>
                                <p>
                                    Al acceder y utilizar el software de gestión "ClickVenta" (en adelante, "El Servicio"), el Usuario acepta someterse íntegramente a los presentes Términos y Condiciones, los cuales constituyen un contrato vinculante conforme a la legislación de la República Argentina. Si no está de acuerdo con estos términos, debe abstenerse de utilizar El Servicio.
                                </p>
                            </section>
                            
                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">2. Naturaleza del Servicio y Responsabilidad</h2>
                                <p>
                                    ClickVenta provee una herramienta digital para la administración de inventario y registro de ventas. El Usuario es el único y exclusivo responsable por la exactitud, legalidad y carga de los datos ingresados al sistema. ClickVenta no asume responsabilidad alguna por pérdidas comerciales, errores de stock, lucro cesante o conflictos laborales derivados del mal uso de la plataforma.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">3. Facturación, Suscripciones y Pasarela de Pago</h2>
                                <p className="mb-2">
                                    El uso del Servicio está sujeto al pago de una suscripción prepaga mensual. La falta de pago o la cancelación de la suscripción resultará en la suspensión inmediata del acceso a la plataforma.
                                </p>
                                <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded-r-lg mt-4 text-emerald-100/80">
                                    <strong className="text-emerald-400 block mb-1">Cláusula de Tercerización de Pagos:</strong>
                                    Todos los cobros y suscripciones son procesados, gestionados y asegurados de manera exclusiva por <strong>MercadoPago (Mercado Libre S.R.L.)</strong>. ClickVenta no interviene en la transacción financiera ni asume responsabilidad por rechazos, retenciones o fallas en dicha plataforma.
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">4. Política de No Reembolso</h2>
                                <p className="mb-2">
                                    Dado que el Servicio consiste en el acceso inmediato a una plataforma digital de gestión, <strong>ClickVenta no realiza devoluciones ni reembolsos de dinero</strong> bajo ninguna circunstancia una vez abonada la suscripción mensual.
                                </p>
                                <ul className="list-disc ml-6 space-y-2 text-sm italic border-l-2 border-white/10 pl-4">
                                    <li>
                                        El Usuario puede cancelar su suscripción en cualquier momento para evitar futuros cobros, pero mantendrá el acceso hasta finalizar el periodo ya pagado.
                                    </li>
                                    <li>
                                        No se realizarán reembolsos proporcionales por días no utilizados dentro de un mes ya facturado.
                                    </li>
                                    <li>
                                        Conforme al Art. 1116 del Código Civil y Comercial de la Nación, el derecho de revocación no es aplicable a suministros de grabaciones sonoras, de video o de <strong>software informático</strong> que hayan sido instalados o utilizados por el consumidor.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">5. Jurisdicción y Ley Aplicable</h2>
                                <p>
                                    Para cualquier divergencia que pudiera surgir en la interpretación o ejecución del presente contrato, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de Tartagal, Provincia de Salta, renunciando a cualquier otro fuero o jurisdicción.
                                </p>
                            </section>
                            
                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">6. Disponibilidad del Servicio (SLA)</h2>
                                <p className="mb-3">
                                    ClickVenta se esfuerza por mantener la plataforma operativa las 24 horas del día. Sin embargo, el Usuario reconoce y acepta que:
                                </p>
                                <ul className="list-disc ml-6 space-y-2 text-sm italic border-l-2 border-white/10 pl-4">
                                    <li>
                                        El Servicio depende de proveedores de infraestructura externos (incluyendo, pero no limitado a: <strong>Supabase Inc., Vercel Inc. y Mercado Libre S.R.L.</strong>).
                                    </li>
                                    <li>
                                        ClickVenta <strong>no garantiza</strong> la disponibilidad ininterrumpida ni tiempos de respuesta específicos, y no será responsable por fallas técnicas, caídas de servidores o errores de conexión ajenos a su control directo.
                                    </li>
                                    <li>
                                        El Servicio se presta <strong>"tal cual es" (As-is)</strong>. ClickVenta se exime de cualquier responsabilidad por <strong>lucro cesante, pérdida de datos comerciales o daños indirectos</strong> derivados de la imposibilidad temporal de acceder a la plataforma durante jornadas de venta.
                                    </li>
                                </ul>
                            </section>
                        </>
                    ) : (
                        <>
                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">1. Marco Legal y Consentimiento</h2>
                                <p>
                                    En estricto cumplimiento de la Ley de Protección de Datos Personales N° 25.326 y sus normas complementarias vigentes en la República Argentina, le informamos que los datos recabados en ClickVenta son tratados con los máximos estándares de confidencialidad y no serán comercializados ni transferidos a terceros no autorizados.
                                </p>
                            </section>
                            
                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">2. Recolección de Datos Limitada</h2>
                                <p>
                                    ClickVenta únicamente almacena información operativa estrictamente necesaria para brindar el servicio: direcciones de correo electrónico, nombres de usuario o comercio, y el registro de inventario y ventas asociado a la cuenta. 
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">3. Seguridad Financiera y Datos de Tarjetas</h2>
                                <div className="bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded-r-lg text-indigo-100/80">
                                    <strong className="text-indigo-400 block mb-1">Cifrado de Nivel Bancario:</strong>
                                    ClickVenta <strong>NO guarda, procesa, ni tiene acceso</strong> a ningún dato de tarjetas de crédito, débito o cuentas bancarias de los Usuarios. Todo el flujo transaccional es delegado a <strong>MercadoPago</strong>, entidad que protege su información financiera bajo normativas del Banco Central de la República Argentina (BCRA) y certificaciones de seguridad PCI-DSS internacionales.
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">4. Derechos ARCO</h2>
                                <p>
                                    El titular de los datos personales tiene la facultad de ejercer el derecho de Acceso, Rectificación, Cancelación y Oposición respecto de sus datos, contactándose con nuestro soporte técnico. La Agencia de Acceso a la Información Pública es el órgano de control habilitado para recibir denuncias.
                                </p>
                            </section>
                        </>
                    )}
                </div>

                <div className="mt-12 pt-6 border-t border-white/10">
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-zinc-700/50"
                    >
                        ← Volver a la plataforma
                    </button>
                </div>

            </div>
        </div>
    );
}