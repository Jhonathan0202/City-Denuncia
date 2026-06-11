import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarDenuncias, atualizarDenuncia } from "../services/denunciaService";
import type { Denuncia } from "../types/Denuncia";
import "../css/editar-denuncia.css";

const EditDenuncia = (): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [endereco, setEndereco] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        return (
            <main className="edit-page">
                <div className="edit-container">
                    <div className="edit-empty">Denúncia não encontrada.</div>
                </div>
            </main>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const updatedDenuncia: Denuncia = {
            ...denuncia,
            titulo,
            descricao,
            endereco,
        };

        void atualizarDenuncia(updatedDenuncia)
            .then(() => {
                setMessage({ type: "success", text: "Denúncia atualizada com sucesso!" });
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
            .catch(() => {
                setMessage({ type: "error", text: "Erro ao atualizar a denúncia. Tente novamente." });
                setIsLoading(false);
            });
    };

    return (
        <main className="edit-page">
            <div className="edit-container">
                <header className="edit-header">
                    <h2>Editar Denúncia</h2>
                    <p>Atualize os detalhes da denúncia #{denuncia.id}</p>
                </header>

                {message && (
                    <div className={`form-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="titulo" className="form-label">
                            Título
                        </label>
                        <input
                            id="titulo"
                            type="text"
                            className="form-input"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descricao" className="form-label">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            className="form-textarea"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endereco" className="form-label">
                            Endereço
                        </label>
                        <input
                            id="endereco"
                            type="text"
                            className="form-input"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn primary" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditDenuncia;
