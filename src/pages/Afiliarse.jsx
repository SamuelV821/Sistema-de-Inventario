import { useNavigate } from "react-router-dom"

function Afiliarse(){
    const navigate = useNavigate();
    return(
        <>
        <button onClick={() => (navigate('/crearNegocio'))}>Crear un negocio</button>
        <button onClick={() => (navigate('/unirseNegocio'))}>Unirse a un negocio</button>
        </>
    )
}
export default Afiliarse