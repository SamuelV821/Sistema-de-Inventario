import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect } from "react";

export function Login (){
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
        },[])

    const manejarDatos = (e) => {
        const {name,value} = e.target;
        setUser({...user,[name]:value});
    }

    const LoguearUsuruario = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password,
        });

        if(!error){
            console.log('Inicio de sesion Correcto');
            navigate('/home');
        }
        else{
            console.log('Error:',error);
        }
    }

    return (
        <>
        <div>
            <input type="mail" name="email" placeholder="usuario@mail.com" onChange={(e) => manejarDatos(e)} value={user.email} />
            <input type="password" name="password" placeholder="Contraseña" onChange={(e) => manejarDatos(e)} value={user.password} />
            <button onClick={LoguearUsuruario}>Enviar</button>
        </div>
        </>
    );
}