import { type JSX, useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { buscarDenuncias, atualizarDenuncia } from "../services/denunciaService";
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

const MinhasDenuncias = (): JSX.Element => {
    const [search, setSearch] = useState<string>("");
    const [categoria, setCategoria] = useState<DenunciaCategoria | "Todas">(
        "Todas",
    );
    const [status, setStatus] = useState<DenunciaStatus | "Todos">("Todos");
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
    const [editForm, setEditForm] = useState<{
        titulo: string;
        descricao: string;
        categoria: DenunciaCategoria;
        endereco: string;
    }>({
        titulo: "",
        descricao: "",
        categoria: "Buraco na via",
        endereco: "",
    });

    useEffect((): void => {
        void buscarDenuncias({ search, categoria, status }).then(setDenuncias);
    }, [search, categoria, status]);

    const currentUser = "João Silva";
    const filteredDenuncias = denuncias.filter(
        (d) => d.denunciante === currentUser,
    );

    const getDisplayLocation = (loc: string | undefined): string => {
        if (!loc) return "";
        const key = loc.trim();
        const map: Record<string, string> = {
            "-23.5505, -46.6333": "São Paulo - SP, Centro, Rua das Flores",
            "-23.5489, -46.6388": "São Paulo - SP, Bela Vista, Av. Principal",
            "-23.5512, -46.6420": "São Paulo - SP, Vila Mariana, Rua do Parque",
            "-23.5478, -46.6301": "São Paulo - SP, Centro, Rua do Cruzeiro",
        };

        return map[key] ?? loc;
    };

    const openEditModal = (denuncia: Denuncia): void => {
        setSelectedDenuncia(denuncia);
        setEditForm({
            titulo: denuncia.titulo,
            descricao: denuncia.descricao,
            categoria: denuncia.categoria,
            endereco: denuncia.endereco ?? "",
        });
    };

    const closeEditModal = (): void => {
        setSelectedDenuncia(null);
    };

    const handleEditChange = (
        field: keyof typeof editForm,
        value: string,
    ): void => {
        setEditForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const saveEdit = (): void => {
        if (!selectedDenuncia) return;

        const updatedDenuncia: Denuncia = {
            ...selectedDenuncia,
            titulo: editForm.titulo,
            descricao: editForm.descricao,
            categoria: editForm.categoria,
            endereco: editForm.endereco,
        };

        setDenuncias((current) =>
            current.map((denuncia) =>
                denuncia.id === selectedDenuncia.id ? updatedDenuncia : denuncia,
            ),
        );

        void atualizarDenuncia(updatedDenuncia);
        closeEditModal();
    };

    return (
        <div className="consultar-denuncias-page">
            <section className="query-header" aria-labelledby="query-title">
                <h2 id="query-title">Minhas Denúncias</h2>
                <p>Acompanhe as denúncias que você registrou.</p>
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

                <div className="mine-note">
                    Exibindo apenas denúncias de <strong>{currentUser}</strong>.
                </div>
            </div>

            <div className="denuncias-grid" aria-label="Lista de denúncias">
                {filteredDenuncias.map((denuncia: Denuncia): JSX.Element => (
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
                                <span className="info-value">{denuncia.endereco ?? getDisplayLocation(denuncia.localizacao)}</span>
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
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <a href="#" className="details-link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="details-icon">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81T40-500q80-143 200-224t266-81q146 0 266 81t200 224q-80 143-200 224t-266 81Z"/>
                                </svg>
                                Ver detalhes completos
                            </a>
                            <button
                                type="button"
                                className="details-link"
                                onClick={() => openEditModal(denuncia)}
                                aria-label={`Editar denúncia ${denuncia.titulo}`}
                            >
                                Editar
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {selectedDenuncia && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <p className="modal-label">Editar denúncia</p>
                                <h3>{selectedDenuncia.titulo}</h3>
                            </div>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeEditModal}
                                aria-label="Fechar modal"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-field">
                                <label htmlFor="edit-title">Título</label>
                                <input
                                    id="edit-title"
                                    value={editForm.titulo}
                                    onChange={(e) => handleEditChange("titulo", e.target.value)}
                                />
                            </div>

                            <div className="modal-field">
                                <label htmlFor="edit-description">Descrição</label>
                                <textarea
                                    id="edit-description"
                                    rows={4}
                                    value={editForm.descricao}
                                    onChange={(e) => handleEditChange("descricao", e.target.value)}
                                />
                            </div>

                            <div className="modal-field">
                                <label htmlFor="edit-endereco">Endereço</label>
                                <input
                                    id="edit-endereco"
                                    value={editForm.endereco}
                                    onChange={(e) => handleEditChange("endereco", e.target.value)}
                                />
                            </div>

                            <div className="modal-field modal-grid">
                                <div>
                                    <label htmlFor="edit-category">Categoria</label>
                                    <Dropdown
                                        id="edit-category"
                                        value={editForm.categoria}
                                        onChange={(value) =>
                                            handleEditChange("categoria", value as DenunciaCategoria)
                                        }
                                        options={categoryOptions.slice(1)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="button-secondary" onClick={closeEditModal}>
                                Cancelar
                            </button>
                            <button type="button" className="button-primary" onClick={saveEdit}>
                                Salvar alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinhasDenuncias;
