import { api } from '@/lib/api';
import { Sales } from '@/types/sales';

export interface SalesQuerySchema extends Partial<Sales> {
    limite?: number;
    pagina?: number;
}

export interface TopProducts {
    codigo_produto: string;
    descricao_produto: string;
    quantidade_total?: string;
    valor_total?: string;
    valor_minimo?: string;
    valor_maximo?: string;
    percentual_diferenca?: string;
    total_historico?: string;
    total?: string;
    qtde?: string;
    id_venda?: string;
}

export interface CompanyParticipation {
    nome_fantasia: string;
    quantidade_total: string;
    percentual: string;
}

export interface CompanyParticipationByValue {
    nome_fantasia: string;
    valor_total: string;
    percentual: string;
}

export class SalesRepository {
    private readonly endpoints = {
        sales: "vendas",
        topProductsByQuantity: "produtos/mais-vendidos",
        topProductsByValue: "produtos/maior-valor",
        priceVariation: "produtos/variacao-preco",
        companyParticipation: "empresas/participacao",
        companyParticipationByValue: "empresas/participacao-por-valor",
    };

    async getSales(query: SalesQuerySchema): Promise<Sales[]> {
        try {
            const endpoint = this.endpoints.sales;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            throw new Error('Falha ao carregar vendas. Tente novamente.');
        }
    }

    async getTopProductsByQuantity(query: SalesQuerySchema): Promise<TopProducts[]> {
        try {
            const endpoint = this.endpoints.topProductsByQuantity;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar produtos por quantidade:', error);
            throw new Error('Falha ao carregar produtos por quantidade.');
        }
    }

    async getTopProductsByValue(query: SalesQuerySchema): Promise<TopProducts[]> {
        try {
            const endpoint = this.endpoints.topProductsByValue;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar produtos por valor:', error);
            throw new Error('Falha ao carregar produtos por valor.');
        }
    }

    async getPriceVariationByProduct(query: SalesQuerySchema): Promise<TopProducts[]> {
        try {
            const endpoint = this.endpoints.priceVariation;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar variação de preços:', error);
            throw new Error('Falha ao carregar variação de preços.');
        }
    }

    async getCompanySalesParticipation(query: SalesQuerySchema): Promise<CompanyParticipation[]> {
        try {
            const endpoint = this.endpoints.companyParticipation;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar participação de empresas:', error);
            throw new Error('Falha ao carregar participação de empresas.');
        }
    }

    async getCompanySalesParticipationByValue(query: SalesQuerySchema): Promise<CompanyParticipationByValue[]> {
        try {
            const endpoint = this.endpoints.companyParticipationByValue;
            const response = await api.get(endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar participação de empresas por valor:', error);
            throw new Error('Falha ao carregar participação de empresas por valor.');
        }
    }
}
