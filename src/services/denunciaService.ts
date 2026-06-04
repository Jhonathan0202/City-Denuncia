import { denunciasMock } from "../mocks/denunciasMock";
import type { Denuncia, DenunciaFilters } from "../types/Denuncia";

const STORAGE_KEY = "city-denuncia-denuncias";

const getStoredDenuncias = (): Denuncia[] => {
    if (typeof window === "undefined") {
        return denunciasMock;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return denunciasMock;
    }

    try {
        return JSON.parse(stored) as Denuncia[];
    } catch {
        return denunciasMock;
    }
};

const saveStoredDenuncias = (items: Denuncia[]): void => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export async function buscarDenuncias(
    filters: DenunciaFilters = {},
): Promise<Denuncia[]> {
    const search = filters.search?.trim().toLowerCase() ?? "";
    const allDenuncias = getStoredDenuncias();

    return allDenuncias.filter((denuncia: Denuncia): boolean => {
        const matchesSearch =
            search.length === 0 ||
            denuncia.titulo.toLowerCase().includes(search) ||
            denuncia.descricao.toLowerCase().includes(search);

        const matchesCategoria =
            !filters.categoria ||
            filters.categoria === "Todas" ||
            denuncia.categoria === filters.categoria;

        const matchesStatus =
            !filters.status ||
            filters.status === "Todos" ||
            denuncia.status === filters.status;

        return matchesSearch && matchesCategoria && matchesStatus;
    });
}

export async function atualizarDenuncia(
    updatedDenuncia: Denuncia,
): Promise<Denuncia> {
    const allDenuncias = getStoredDenuncias();
    const nextDenuncias = allDenuncias.map((denuncia) =>
        denuncia.id === updatedDenuncia.id ? updatedDenuncia : denuncia,
    );

    saveStoredDenuncias(nextDenuncias);
    return updatedDenuncia;
}
