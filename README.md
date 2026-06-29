# Certificate Hub

Sistema de Emissão e Validação de Certificados Digitais.

## Tecnologias

- React 19
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS 4
- Vite
- Radix UI
- Recharts
- Jest
- Playwright

## Como executar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API

# Iniciar servidor de desenvolvimento
npm run dev
```

## Scripts disponíveis

| Comando               | Descrição                  |
| --------------------- | -------------------------- |
| `npm run dev`         | Inicia servidor de dev     |
| `npm run build`       | Build de produção          |
| `npm run preview`     | Preview do build           |
| `npm run lint`        | Executa ESLint             |
| `npm run format`      | Formata código com Prettier|
| `npm test`            | Executa testes unitários   |
| `npm run test:e2e`    | Executa testes E2E         |

## Estrutura

```
src/
├── components/   # Componentes reutilizáveis
├── hooks/        # Hooks customizados
├── lib/          # Utilitários e configurações
├── models/       # Tipos e interfaces
├── routes/       # Páginas (TanStack Router)
├── services/     # API e serviços
├── view-models/  # Lógica de estado das views
└── views/        # Componentes de página
```

## Autor

Igor Dev
