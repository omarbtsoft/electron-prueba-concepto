// PersonaDetalle.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Persona {
    id: number;
    nombre: string;
    email: string;
    edad: number;
}

function PersonaDetalle() {
    const { id } = useParams<{ id: string }>();
    const [persona, setPersona] = useState<Persona | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8080/api/persona/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Persona no encontrada");
                return res.json();
            })
            .then((data: Persona) => setPersona(data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Cargando persona...</p>;

    if (!persona) return <p>Persona no encontrada</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial" }}>
            <h1>Detalle de la Persona</h1>
            <p><strong>Nombre:</strong> {persona.nombre}</p>
            <p><strong>Email:</strong> {persona.email}</p>
            <p><strong>Edad:</strong> {persona.edad}</p>
            <Link to="/" style={{ display: "block", marginTop: "20px", color: "#007bff" }}>
                ← Volver a la lista
            </Link>
        </div>
    );
}

export default PersonaDetalle;
