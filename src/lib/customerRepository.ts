import { api } from '@/lib/api';
import { Customer, ResumoAtraso } from '@/types/customer';

export interface CustomerQuerySchema {
    nome?: string;
    id_cliente?: string;
    limite?: number;
}

export class CustomerRepository {
    private readonly endpointClientes = 'clientes';
    private readonly endpointResumo = '/contas_receber/resumo';

    async search(query: CustomerQuerySchema): Promise<Customer[]> {
        try {
            const response = await api.get(this.endpointClientes, { params: query });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw new Error('Falha ao carregar clientes. Tente novamente.');
        }
    }

    async fetchResumo(): Promise<ResumoAtraso> {
        try {
            const response = await api.get(this.endpointResumo);
            let { data } = response;
            let total = 0;

            // Calcular total se não vier da API
            for (const key of Object.keys(data)) {
                if (key !== 'total') {
                    data[key] = Number(data[key]);
                    total += data[key];
                }
            }

            // Adicionar total se não existir
            if (!data.total) {
                data['total'] = total;
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar resumo de títulos:', error);
            throw new Error('Falha ao carregar resumo de títulos. Tente novamente.');
        }
    }
}
