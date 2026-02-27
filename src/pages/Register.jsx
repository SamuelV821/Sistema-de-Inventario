import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Register(){
  const [user,setUser] = useState({
    email:'',
    password:''
  });
  const navigate = useNavigate();
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  
   useEffect(() => {
          const comprobarSesion = async () => {
              const { data: { session } } = await supabase.auth.getSession();
              
              // Si hay sesión activa, lo mandamos al panel de control
              if (session) {
                  navigate('/home');
              }
          }
          comprobarSesion();
      },[]);

  const manejarDatos = (e) => {
    const {name,value} = e.target
    setUser({...user,[name]:value})
  }

  const RegistrarUsuario = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    })
    if (!error){
      const { errorperfil } = await supabase
      .from('perfiles')
      .insert({ id_auth: data.user.id  })
      console.log('Usuario creado');
      navigate('/home')
      if(errorperfil){
        console.log('Error al crear perfil: ',errorperfil);
      }
    }
    else{
      alert('Por favor ingrese un E-mail y contraseña validos');
      console.log('Error:',error)

    }
  }

  return (
    <>
      <div    className="h-screen flex items-center justify-center">

            <div className="flex flex-col bg-zinc-400/10 rounded-3xl w-fit p-8 gap-8 items-center justify-center">

                <div className="flex items-center gap-3 tracking-tight font-black text-4xl">
                    <span className="text-slate-100 italic">Crear</span>
                    <span className="text-indigo-500 italic">Cuenta</span>
                </div>

                <p className="text-center font-light text-slate-300 text-xs">
                  Sumate a la revolucion de ClickVenta.
                  </p>         
            
                <form className="flex flex-col p-10 gap-6 text-slate-400" onSubmit={(e) => RegistrarUsuario(e)}>

                    <label className="font-black">E-mail</label>
                    <input className="bg-zinc-950 p-4 border-zinc-700/60 border-1 text-center rounded-2xl" type="mail" name="email" placeholder="usuario@mail.com" onChange={(e) => manejarDatos(e)} value={user.email} />
                    <label className="font-black">Contraseña</label>
                    <input className="bg-zinc-950 p-4 border-zinc-700/60 border-1 text-center rounded-2xl" type="password" name="password" placeholder="********" onChange={(e) => manejarDatos(e)} value={user.password} />

                      {/* SECCIÓN DEL CHECKBOX LEGAL */}
                    <div className="flex items-start gap-3 px-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="terminos"
                            className="mt-1 w-5 h-5 accent-indigo-500 cursor-pointer"
                            onChange={(e) => setAceptoTerminos(e.target.checked)}
                        />
                        <label htmlFor="terminos" className="text-xs md:text-sm leading-tight cursor-pointer">
                            He leído y acepto los <a href="/terminos" target="_blank" className="text-indigo-400 hover:underline font-bold">Términos y Condiciones</a>, la <a href="/privacidad" target="_blank" className="text-indigo-400 hover:underline font-bold">Política de Privacidad</a>.
                        </label>
                    </div>

                          {/* BOTÓN: Se deshabilita si no aceptó */}
                    <button 
                        disabled={!aceptoTerminos}
                        className={`text-zinc-950 mt-5 p-4 rounded-2xl transition-all shadow-md font-bold
                            ${aceptoTerminos 
                                ? "bg-indigo-500 shadow-indigo-500/50 hover:shadow-indigo-500/90 hover:bg-indigo-400" 
                                : "bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-50 shadow-none"
                            }`} 
                        type="submit"
                    >
                        Crear cuenta
                    </button>

                </form>

                <div className="flex flex-row p-2 gap-2">
                    <span>¿Ya tienes una cuenta?</span><button className="text-indigo-500" onClick={() => navigate('/login')}>¡Ingresa!</button>
                </div>
               

            </div>

        </div>

    </>
  )

}



  