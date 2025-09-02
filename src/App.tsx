// App.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const appName = import.meta.env.VITE_APP_NAME;
interface Persona {
  id: number;
  nombre: string;
  email: string;
  edad: number;
}

function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/listar")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la API");
        return res.json();
      })
      .then((data: Persona[]) => setPersonas(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando lista...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial" }}>
      Dato desde: {appName}
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Lista de Personas</h1>
      {personas.length === 0 ? (
        <p>No hay personas registradas</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {personas.map((persona) => (
            <li
              key={persona.id}
              onClick={() => navigate(`/persona/${persona.id}`)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <p><strong>Nombre:</strong> {persona.nombre}</p>
              <p><strong>Email:</strong> {persona.email}</p>
              <p><strong>Edad:</strong> {persona.edad}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
