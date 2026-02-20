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

  const RegistrarUsuario = async () => {
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
      console.log('Error:',error)

    }
  }

  return (
    <>
      <div className='bg-gray-300 h-screen'>
        <input className='bg-amber-200 m-5' type="mail" name='email' placeholder='' value={user.email} onChange={(e) => manejarDatos(e)} />
          <input className='bg-amber-200 m-5' type="password" name='password' placeholder='' value={user.password} onChange={(e) => manejarDatos(e)}/>
          <button onClick={RegistrarUsuario}>Enviar</button>
      </div>
    </>
  )

}

  