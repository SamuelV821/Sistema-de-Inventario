import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function ActualizarPassword() {
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Esta es la función mágica que cambia la clave de la sesión actual
    const { error } = await supabase.auth.updateUser({ 
      password: password 
    });

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      alert("¡Contraseña actualizada! Ya puedes iniciar sesión.");
      navigate("/login");
    }
    setCargando(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
      <form onSubmit={handleUpdate} className="bg-zinc-900 p-8 rounded-2xl border border-white/5 flex flex-col gap-4 w-80">
        <h2 className="text-xl font-black text-emerald-500 italic">Nueva Contraseña</h2>
        <p className="text-xs text-slate-400">Ingresa tu nueva clave de acceso.</p>
        
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          className="bg-zinc-800 p-3 rounded-xl border border-white/10 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          disabled={cargando}
          className="bg-emerald-500 p-3 rounded-xl font-black text-zinc-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          {cargando ? "Actualizando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}