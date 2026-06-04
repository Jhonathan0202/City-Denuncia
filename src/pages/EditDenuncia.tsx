import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarDenuncias } from "../services/denunciaService";
import type { Denuncia } from "../types/Denuncia";

const EditDenuncia = (): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [endereco, setEndereco] = useState("");

    useEffect(() => {
        void buscarDenuncias({}).then((list) => {
            const found = list.find((d) => String(d.id) === String(id));
            if (found) {
                setDenuncia(found);
                setTitulo(found.titulo);
                    setDescricao(found.descricao);
                    setEndereco(found.endereco ?? "");
            }
        });
    }, [id]);

    if (!denuncia) {
        return <main style={{ padding: 24 }}>Denúncia não encontrada.</main>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Simulação de atualização da denúncia ${denuncia.id}\nEndereço: ${endereco}`);
        navigate(-1);
    };

    return (
        <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
            <h2>Editar denúncia</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Título
                    <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                </label>
                <label>
                    Descrição
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </label>
                <label>
                    Endereço
                    <input value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                </label>
                <button type="submit">Salvar (simulação)</button>
            </form>
        </main>
    );
};

export default EditDenuncia;
