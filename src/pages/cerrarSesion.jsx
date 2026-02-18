import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";

function CerrarSesion(){
   const navigate = useNavigate();
    useEffect(()=>{
        const cerrarSesion = async () => {
        const { error } = await supabase.auth.signOut()
        navigate('/');
        }
        cerrarSesion();
    },[])

    return(
        <></>
    )
}
export default CerrarSesion