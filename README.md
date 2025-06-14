# TechFinance Web - Sistema de Gestão Financeira

Uma aplicação web moderna para gestão financeira e de produtos, desenvolvida com Next.js 15 e baseada na versão mobile existente.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- Sistema de login com validação
- Proteção de rotas
- Persistência de sessão com localStorage
- Credenciais de acesso: `admin/admin`

### ✅ Dashboard Principal
- Interface responsiva com cards de módulos
- Animações suaves com Framer Motion
- Navegação intuitiva entre módulos

### ✅ Módulo de Produtos
- Busca de produtos por nome ou código
- Interface moderna com cards de produtos
- Modal de detalhes do produto
- Dados simulados (mock) para demonstração

### 🚧 Módulos em Desenvolvimento
- **Vendas**: Gerenciamento de vendas
- **Clientes**: Gestão de clientes
- **Títulos**: Controle financeiro
- **Relatórios**: Análises e insights
- **Dinho Bot**: Assistente virtual

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações suaves
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos para executar

1. **Clone o repositório e navegue para a pasta web**
   ```bash
   cd web
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:3000`
   - Use as credenciais: **admin/admin**

## 🎨 Design e UX

### Cores Principais
- **Azul Primário**: `#3B82F6` (blue-500)
- **Cinza Claro**: `#F9FAFB` (gray-50)
- **Texto Principal**: `#1F2937` (gray-800)

### Componentes Responsivos
- Layout adaptável para desktop, tablet e mobile
- Cards com hover effects e animações
- Interface moderna e limpa

### Navegação
- Header com informações do usuário e logout
- Botão "Voltar" em todas as páginas internas
- Navegação por breadcrumbs visual

## 📱 Compatibilidade com Mobile App

Esta versão web mantém consistência visual e funcional com a versão mobile:

- **Mesma estrutura de navegação**
- **Cores e tipografia consistentes**
- **Funcionalidades equivalentes** (onde implementadas)
- **Mesmo fluxo de autenticação**

## 🗂️ Estrutura do Projeto

```
web/
├── src/
│   ├── app/                 # Pages e roteamento (App Router)
│   │   ├── page.tsx         # Página de login
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── products/        # Módulo de produtos
│   │   ├── sales/          # Módulo de vendas
│   │   ├── customers/      # Módulo de clientes
│   │   ├── titles/         # Módulo de títulos
│   │   ├── reports/        # Módulo de relatórios
│   │   └── chat/           # Módulo do chat bot
│   ├── components/         # Componentes reutilizáveis
│   │   └── Header.tsx      # Header principal
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.ts      # Hook de autenticação
│   ├── lib/                # Bibliotecas e utilitários
│   │   └── productRepository.ts # Repositório de produtos
│   └── types/              # Definições de tipos TypeScript
│       └── product.ts      # Tipos do produto
├── public/                 # Arquivos estáticos
└── tailwind.config.ts      # Configuração do Tailwind
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm run start

# Linting
npm run lint
```

## 🌟 Próximos Passos

1. **Implementar módulos restantes** (Vendas, Clientes, etc.)
2. **Conectar com API real** (substituir mocks)
3. **Adicionar testes automatizados**
4. **Implementar PWA** para experiência mobile
5. **Otimizar performance** com cache e lazy loading

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
