import { denunciasMock } from "../mocks/denunciasMock";
import type { Denuncia, DenunciaFilters } from "../types/Denuncia";

export async function buscarDenuncias(
    filters: DenunciaFilters = {},
): Promise<Denuncia[]> {
    const search = filters.search?.trim().toLowerCase() ?? "";

    return denunciasMock.filter((denuncia: Denuncia): boolean => {
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
