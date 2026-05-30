export type DenunciaCategoria =
    | "Buraco na via"
    | "Esgoto"
    | "Iluminação"
    | "Sinalização";

export type DenunciaStatus =
    | "Pendente"
    | "Em Análise"
    | "Em Andamento"
    | "Resolvida";

export type Denuncia = {
    id: string;
    titulo: string;
    categoria: DenunciaCategoria;
    status: DenunciaStatus;
    descricao: string;
    localizacao: string;
    denunciante: string;
    registradoEm: string;
};

export type DenunciaFilters = {
    search?: string;
    categoria?: DenunciaCategoria | "Todas";
    status?: DenunciaStatus | "Todos";
};
