import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export function Home(){
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

    

    return(
        <>
        <h1>Landing page</h1>
        <br />
        <button onClick={() => navigate('/login')}>Logearse</button>
        <br />
        <button onClick={() => navigate('/register')}>Registrarse</button>
        </>
        
    );

    
}