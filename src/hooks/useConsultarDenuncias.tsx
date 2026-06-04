import { useEffect, useState } from "react";
import type { Denuncia, DenunciaCategoria, DenunciaStatus } from "../types/Denuncia";
import { buscarDenuncias } from "../services/denunciaService";

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

export default function useConsultarDenuncias() {
    const [search, setSearch] = useState<string>("");
    const [categoria, setCategoria] = useState<DenunciaCategoria | "Todas">(
        "Todas",
    );
    const [status, setStatus] = useState<DenunciaStatus | "Todos">("Todos");
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect((): void => {
        (async () => {
            const response = await buscarDenuncias({ search, categoria, status });
            setDenuncias(response);
            setLoading(false);
        })();
    }, [search, categoria, status]);

    return {
        search,
        categoria,
        status,
        denuncias,
        loading,
        categoryOptions,
        statusOptions,
        setSearch,
        setCategoria,
        setStatus,
    }
}
