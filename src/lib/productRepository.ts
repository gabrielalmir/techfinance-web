import { api } from '@/lib/api';
import { Product } from '@/types/product';

export interface ProductQuerySchema {
    nome?: string;
    codigo?: string;
    limite?: number;
}

export class ProductRepository {
    private readonly endpoint = 'produtos';

    async search(query: ProductQuerySchema): Promise<Product[]> {
        try {
            const response = await api.get(this.endpoint, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw new Error('Falha ao carregar produtos. Tente novamente.');
        }
    }
}
