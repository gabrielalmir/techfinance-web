# Integração com APIs Reais - TechFinance Web

## 🔗 Conexão com API

A aplicação web TechFinance foi conectada com as APIs reais disponíveis em:
- **Base URL**: `https://techfinance-api.fly.dev`
- **Documentação Swagger**: `https://techfinance-api.fly.dev/docs`

## 📁 Estrutura de Integração

### 1. Serviço de API Centralizado (`/src/lib/api.ts`)
```typescript
import axios from 'axios';

const API_BASE_URL = 'https://techfinance-api.fly.dev';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Funcionalidades:**
- ✅ Configuração centralizada do Axios
- ✅ Interceptors para tratamento de erros
- ✅ Timeout configurado (10 segundos)
- ✅ Headers padrão definidos
- ✅ Tratamento de erros 401, 404, 500+

### 2. Repositórios Atualizados

#### SalesRepository (`/src/lib/salesRepository.ts`)
**Endpoints conectados:**
- `GET /vendas` - Buscar vendas
- `GET /produtos/mais-vendidos` - Top produtos por quantidade
- `GET /produtos/maior-valor` - Top produtos por valor
- `GET /produtos/variacao-preco` - Variação de preços
- `GET /empresas/participacao` - Participação por quantidade
- `GET /empresas/participacao-por-valor` - Participação por valor

#### CustomerRepository (`/src/lib/customerRepository.ts`)
**Endpoints conectados:**
- `GET /clientes` - Buscar clientes
- `GET /contas_receber/resumo` - Resumo de títulos

#### ProductRepository (`/src/lib/productRepository.ts`)
**Endpoints conectados:**
- `GET /produtos` - Buscar produtos

## 🛠️ Funcionalidades Implementadas

### 1. **Módulo de Vendas** (`/sales`)
- ✅ Conectado com API real
- ✅ Busca por cliente/produto
- ✅ Paginação com limite
- ✅ Tratamento de erros
- ✅ Loading states

### 2. **Módulo de Clientes** (`/customers`)
- ✅ Conectado com API real
- ✅ Busca por nome ou ID
- ✅ Limite de resultados
- ✅ Modal de detalhes
- ✅ Tratamento de erros

### 3. **Módulo de Produtos** (`/products`)
- ✅ Conectado com API real
- ✅ Busca por nome ou código
- ✅ Limite de resultados
- ✅ Modal de detalhes
- ✅ Tratamento de erros

### 4. **Módulo de Títulos** (`/titles`)
- ✅ Conectado com API real
- ✅ Resumo de atrasos
- ✅ Cálculo automático de totais
- ✅ Insights do Dinho Bot
- ✅ Tratamento de erros

## 🔧 Tratamento de Erros

### Componente ErrorMessage (`/src/components/ErrorMessage.tsx`)
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}
```

**Funcionalidades:**
- ✅ Exibição consistente de erros
- ✅ Botão de retry opcional
- ✅ Animações suaves
- ✅ Design responsivo

### Estados de Erro Tratados
- **401 Unauthorized**: Token expirado/inválido
- **404 Not Found**: Recurso não encontrado
- **500+ Server Error**: Erro interno do servidor
- **Network Error**: Falha de conexão
- **Timeout**: Requisição demorou muito

## 📊 Parâmetros de Consulta

### Vendas
```typescript
interface SalesQuerySchema {
  limite?: number;
  pagina?: number;
  // Todos os campos de Sales são opcionais para filtros
}
```

### Clientes
```typescript
interface CustomerQuerySchema {
  nome?: string;
  id_cliente?: string;
  limite?: number;
}
```

### Produtos
```typescript
interface ProductQuerySchema {
  nome?: string;
  codigo?: string;
  limite?: number;
}
```

## 🚀 Como Usar

### 1. Desenvolvimento
```bash
npm run dev
```

### 2. Testando APIs
- Acesse `http://localhost:3000`
- Faça login com `admin/admin`
- Navegue pelos módulos para testar as APIs

### 3. Monitoramento
- Verifique o console do navegador para logs de API
- Erros são logados automaticamente
- Network tab mostra requisições HTTP

## 📈 Performance

### Otimizações Implementadas
- ✅ **Debounce**: Evita múltiplas requisições
- ✅ **Loading States**: Feedback visual durante carregamento
- ✅ **Error Boundaries**: Tratamento gracioso de erros
- ✅ **Timeout**: Evita requisições infinitas
- ✅ **Retry Logic**: Permite tentar novamente

### Configurações de Performance
```typescript
// Timeout de 10 segundos
timeout: 10000

// Limite padrão de resultados
limite: 10 (clientes/produtos)
limite: 50 (vendas)
```

## 🔐 Segurança

### Headers de Segurança
```typescript
headers: {
  'Content-Type': 'application/json',
  // Futuramente: Authorization com JWT
}
```

### Validação de Dados
- ✅ Validação de tipos TypeScript
- ✅ Sanitização de parâmetros de busca
- ✅ Tratamento de respostas vazias
- ✅ Validação de campos obrigatórios

## 📝 Próximos Passos

### Melhorias Futuras
1. **Autenticação JWT**: Implementar tokens de acesso
2. **Cache**: Adicionar cache de requisições
3. **Offline Support**: Funcionalidade offline
4. **Real-time**: WebSockets para atualizações em tempo real
5. **Paginação Avançada**: Scroll infinito
6. **Filtros Avançados**: Mais opções de filtro

### APIs Pendentes
- Relatórios específicos
- Análises avançadas
- Exportação de dados
- Configurações de usuário

## 🐛 Troubleshooting

### Problemas Comuns

1. **CORS Error**
   - Verificar se a API permite requisições do domínio
   - Configurar headers apropriados

2. **Network Error**
   - Verificar conectividade
   - Confirmar URL da API
   - Verificar firewall/proxy

3. **Timeout**
   - Aumentar timeout se necessário
   - Verificar performance da API

4. **404 Endpoints**
   - Verificar documentação Swagger
   - Confirmar endpoints disponíveis

### Logs Úteis
```javascript
// Console do navegador
console.log('API Request:', config);
console.log('API Response:', response);
console.error('API Error:', error);
```

---

## 📞 Suporte

Para problemas com a integração das APIs:
1. Verificar logs do console
2. Testar endpoints no Swagger
3. Verificar conectividade de rede
4. Consultar documentação da API

**Status da Integração**: ✅ **COMPLETA E FUNCIONAL**
