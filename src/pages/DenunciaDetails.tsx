import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buscarDenuncias } from "../services/denunciaService";
import type { Denuncia } from "../types/Denuncia";
import "../css/denuncia-details.css";

const DenunciaDetails = (): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [denuncia, setDenuncia] = useState<Denuncia | null>(null);

    useEffect(() => {
        void buscarDenuncias({}).then((list) => {
            const found = list.find((d) => String(d.id) === String(id));
            if (found) setDenuncia(found);
        });
    }, [id]);

    if (!denuncia) {
        return (
            <main className="denuncia-page">
                <div className="denuncia-container">
                    <div className="denuncia-empty">Denúncia não encontrada.</div>
                </div>
            </main>
        );
    }

    return (
        <main className="denuncia-page">
            <div className="denuncia-container">
                <header className="denuncia-header">
                    <h2 className="denuncia-title">{denuncia.titulo}</h2>
                    <div className="denuncia-badges">
                        <span className="badge categoria">{denuncia.categoria}</span>
                        <span className="badge status">{denuncia.status}</span>
                    </div>
                </header>

                <section className="denuncia-meta">
                    {denuncia.endereco && (
                        <div className="meta-item">
                            <strong>Endereço</strong>
                            <div>{denuncia.endereco}</div>
                        </div>
                    )}

                    {denuncia.localizacao && (
                        <div className="meta-item">
                            <strong>Localização</strong>
                            <div>{denuncia.localizacao}</div>
                        </div>
                    )}

                    <div className="meta-item">
                        <strong>Denunciante</strong>
                        <div>{denuncia.denunciante}</div>
                    </div>

                    <div className="meta-item">
                        <strong>Registrado em</strong>
                        <div>{new Date(denuncia.registradoEm).toLocaleString()}</div>
                    </div>
                </section>

                <section className="denuncia-description">
                    <h3>Descrição</h3>
                    <p className="description-text">{denuncia.descricao}</p>
                </section>

                <div className="denuncia-actions">
                    <button className="btn secondary" onClick={() => navigate(-1)}>
                        Voltar
                    </button>
                    <Link to={`/editar-denuncia/${denuncia.id}`} className="btn">
                        Editar
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default DenunciaDetails;
