import { type JSX, useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { buscarDenuncias } from "../services/denunciaService";
import type {
    Denuncia,
    DenunciaCategoria,
    DenunciaStatus,
} from "../types/Denuncia";
import "../css/consultar-denuncias.css";

const categoryOptions = [
    { label: "Todas", value: "Todas" },
    { label: "Buraco na via", value: "Buraco na via" },
    { label: "Esgoto", value: "Esgoto" },
    { label: "Iluminação", value: "Iluminação" },
    { label: "Sinalização", value: "Sinalização" },
];

const statusOptions = [
    { label: "Todos", value: "Todos" },
    { label: "Pendente", value: "Pendente" },
    { label: "Em Análise", value: "Em Análise" },
    { label: "Em Andamento", value: "Em Andamento" },
    { label: "Resolvida", value: "Resolvida" },
];

const ConsultarDenuncias = (): JSX.Element => {
    const [search, setSearch] = useState<string>("");
    const [categoria, setCategoria] = useState<DenunciaCategoria | "Todas">(
        "Todas",
    );
    const [status, setStatus] = useState<DenunciaStatus | "Todos">("Todos");
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);

    useEffect((): void => {
        void buscarDenuncias({ search, categoria, status }).then(setDenuncias);
    }, [search, categoria, status]);

    const quantidadeTexto = `${denuncias.length} denúncia(s) encontrada(s)`;

    return (
        <div className="consultar-denuncias-page">
            <section className="query-header" aria-labelledby="query-title">
                <h2 id="query-title">Consultar Denúncias</h2>
                <p>Acompanhe os registros urbanos feitos pela comunidade.</p>
            </section>

            <div className="filters-card" aria-label="Filtros de denúncias">
                <div className="filters-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="filter-icon">
                        <path d="M400-240q-17 0-28.5-11.5T360-280q0-17 11.5-28.5T400-320h160q17 0 28.5 11.5T600-280q0 17-11.5 28.5T560-240H400Zm-120-120q-17 0-28.5-11.5T240-400q0-17 11.5-28.5T280-440h400q17 0 28.5 11.5T720-400q0 17-11.5 28.5T680-360H280Zm-80-120q-17 0-28.5-11.5T160-520q0-17 11.5-28.5T200-560h560q17 0 28.5 11.5T800-520q0 17-11.5 28.5T760-480H200Z"/>
                    </svg>
                    <h3>Filtros de Busca</h3>
                </div>
                <div className="filters-grid">
                    <div className="filter-field search-field">
                        <label htmlFor="complaint-search">Buscar</label>
                        <input
                            id="complaint-search"
                            type="text"
                            placeholder="Buscar por título ou descrição..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="complaint-category-control">Categoria</label>
                        <Dropdown
                            id="complaint-category"
                            value={categoria}
                            onChange={(value) =>
                                setCategoria(value as DenunciaCategoria | "Todas")
                            }
                            options={categoryOptions}
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="complaint-status-control">Status</label>
                        <Dropdown
                            id="complaint-status"
                            value={status}
                            onChange={(value) =>
                                setStatus(value as DenunciaStatus | "Todos")
                            }
                            options={statusOptions}
                        />
                    </div>
                </div>

                <p className="query-count" aria-live="polite">
                    {quantidadeTexto}
                </p>
            </div>

            <div className="denuncias-grid" aria-label="Lista de denúncias">
                {denuncias.map((denuncia: Denuncia): JSX.Element => (
                    <article className="denuncia-card" key={denuncia.id}>
                        <div className="complaint-card-header">
                            <h3>{denuncia.titulo}</h3>
                            <div className="badges">
                                <span className="badge category-badge">
                                    {denuncia.categoria}
                                </span>
                                <span
                                    className={`badge status-badge ${denuncia.status
                                        .toLowerCase()
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {denuncia.status}
                                </span>
                            </div>
                        </div>

                        <p className="complaint-description">
                            {denuncia.descricao}
                        </p>

                        <div className="complaint-info">
                            <div className="info-item">
                                <span className="info-label">Localização:</span>
                                <span className="info-value">{denuncia.localizacao}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Denunciante:</span>
                                <span className="info-value">{denuncia.denunciante}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Registrado em:</span>
                                <span className="info-value">{denuncia.registradoEm}</span>
                            </div>
                        </div>

                        <hr className="complaint-divider" />

                        <a href="#" className="details-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="details-icon">
                                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81T40-500q80-143 200-224t266-81q146 0 266 81t200 224q-80 143-200 224t-266 81Z"/>
                            </svg>
                            Ver detalhes completos
                        </a>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ConsultarDenuncias;
