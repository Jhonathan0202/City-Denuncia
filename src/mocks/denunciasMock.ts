import type { Denuncia } from "../types/Denuncia";

export const denunciasMock: Denuncia[] = [
    {
        id: "1",
        titulo: "Buraco na Rua das Flores",
        categoria: "Buraco na via",
        status: "Pendente",
        descricao: "Buraco grande causando riscos aos motoristas e pedestres",
        localizacao: "-23.5505, -46.6333",
        denunciante: "João Silva",
        registradoEm: "15/04/2026 às 10:30",
    },
    {
        id: "2",
        titulo: "Esgoto vazando na Av. Principal",
        categoria: "Esgoto",
        status: "Em Análise",
        descricao: "Vazamento de esgoto há 3 dias, mau cheiro forte",
        localizacao: "-23.5489, -46.6388",
        denunciante: "Maria Santos",
        registradoEm: "14/04/2026 às 14:20",
    },
    {
        id: "3",
        titulo: "Iluminação queimada no Parque",
        categoria: "Iluminação",
        status: "Em Andamento",
        descricao: "Poste de luz queimado há 1 semana, área muito escura à noite",
        localizacao: "-23.5512, -46.6420",
        denunciante: "Carlos Lima",
        registradoEm: "13/04/2026 às 08:15",
    },
    {
        id: "4",
        titulo: "Falta de placa de PARE",
        categoria: "Sinalização",
        status: "Resolvida",
        descricao: "Cruzamento perigoso sem sinalização adequada",
        localizacao: "-23.5478, -46.6301",
        denunciante: "Ana Costa",
        registradoEm: "10/04/2026 às 16:45",
    },
];
