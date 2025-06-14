export interface Customer {
    id_cliente: number;
    razao_cliente: string;
    nome_fantasia: string;
    cidade: string;
    uf: string;
    id_grupo: string;
    descricao_grupo: string;
}

export interface ResumoAtraso {
    atraso_30_60: number;
    atraso_ate_30: number;
    outro: number;
    vence_ate_30: number;
    vencimento_hoje: number;
    vencimento_superior_30: number;
    total: number;
}
