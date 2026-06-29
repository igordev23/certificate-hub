
<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/TanStack_Router-1.168-FF4154?logo=reactrouter&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/coverage-≥75%25-brightgreen" alt="Coverage" />
</p>

<h1 align="center">📜 Certificate Hub</h1>

<p align="center">
  Sistema completo para <strong>emissão, gestão e validação</strong> de certificados digitais.
  <br />
  Crie templates personalizados, emita certificados em lote e disponibilize validação pública.
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-stack">Stack</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-começando">Começando</a> •
  <a href="#-scripts">Scripts</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-testes">Testes</a>
</p>

---

## 📋 Sobre

O **Certificate Hub** é uma plataforma web moderna para gerenciamento de certificados digitais. Ele permite que instituições de ensino, plataformas de cursos e empresas criem templates personalizados, emitam certificados com códigos únicos de verificação, e disponibilizem um canal público para validação de autenticidade.

O projeto adota uma arquitetura MVVM (Model-View-ViewModel) com React 19, TypeScript e TanStack Router, garantindo separação clara de responsabilidades, tipagem estática e navegação eficiente.

### Problema resolvido

- ❌ Dificuldade em gerenciar certificados manualmente
- ❌ Ausência de canal de verificação pública contra fraudes
- ❌ Processo manual e propenso a erros
- ✅ Plataforma unificada de emissão e validação
- ✅ Código único de verificação por certificado
- ✅ Templates reutilizáveis com layout configurável

---

## ✨ Funcionalidades

### Gestão de Certificados
- Emissão individual ou em lote de certificados
  - Nome do destinatário, CPF, curso, carga horária
  - Associação a template personalizado
  - Geração automática de código de verificação
  - Definição de data de validade
- Listagem com busca e filtros
- Edição e cancelamento

### Templates
- Criação de templates com layout configurável (`layoutConfig`)
- Listagem e edição de templates existentes
- Reutilização entre múltiplos certificados

### Dashboard
- Visão geral com métricas e indicadores
- Gráficos com Recharts para análise de dados
- Acompanhamento de envios

### Validação Pública
- Página pública de verificação (`/verificar`)
- Validação por código único de verificação
- Confirmação de autenticidade do certificado

### Técnicas
- UI componentizada com **shadcn/ui** + **Radix UI** (46+ primitives acessíveis)
- Formulários com validação via **react-hook-form** + **Zod**
- Estado do servidor gerenciado com **TanStack Query** (cache, refetch, mutations)
- Navegação type-safe com **TanStack Router** (file-based routing)
- Notificações toast com **Sonner**
- Testes unitários (Jest + Testing Library) e E2E (Playwright)

---

## 🛠 Stack

| Categoria | Tecnologias |
|-----------|------------|
| **Core** | React 19, TypeScript 5.8, Vite 7 |
| **Roteamento** | TanStack Router (file-based, type-safe) |
| **Estado** | TanStack Query 5 (server state) |
| **Estilização** | Tailwind CSS 4, tw-animate-css, clsx, tailwind-merge |
| **UI** | shadcn/ui, Radix UI, Lucide React, Sonner |
| **Formulários** | react-hook-form, Zod, @hookform/resolvers |
| **Gráficos** | Recharts |
| **Data** | date-fns |
| **Testes** | Jest 30 + Testing Library, Playwright |
| **Ferramentas** | ESLint 9, Prettier 3, Husky (opcional) |

---

## 🏗 Arquitetura

O projeto segue o padrão **MVVM (Model-View-ViewModel)**:

```
src/
├── models/        # Tipos e interfaces (Model)
├── view-models/   # Lógica de estado e actions (ViewModel)
├── views/         # Componentes de apresentação (View)
├── services/      # Camada de comunicação com API
├── hooks/         # Hooks customizados
├── components/    # Componentes reutilizáveis (incl. shadcn/ui)
├── lib/           # Utilitários e configurações
└── routes/        # Definição de rotas (TanStack Router)
```

**Fluxo de dados:**
1. `Route` → carrega `View`
2. `View` → consome `ViewModel` (hooks customizados)
3. `ViewModel` → usa `Service` para comunicação HTTP
4. `Service` → retorna dados tipados (`Model`)
5. `TanStack Query` → gerencia cache, loading e mutations

### Rotas da aplicação

| Rota | Descrição | Autenticada |
|------|-----------|:---:|
| `/` | Landing page | ❌ |
| `/dashboard` | Dashboard com métricas | ✅ |
| `/certificados` | Listagem de certificados | ✅ |
| `/certificados/novo` | Emitir novo certificado | ✅ |
| `/certificados/:id/editar` | Editar certificado | ✅ |
| `/templates` | Listagem de templates | ✅ |
| `/templates/:id/edit` | Editar template | ✅ |
| `/envios` | Gerenciar envios | ✅ |
| `/verificar` | Validação pública de certificado | ❌ |

---

## 🚀 Começando

### Pré-requisitos

- Node.js >= 18
- npm ou bun

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/usuario/certificate-hub.git
cd certificate-hub

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API:
# VITE_API_URL=https://api.exemplo.com
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes em modo watch
npm test -- --watch

# Verificar lint
npm run lint
```

### Build de produção

```bash
# Build otimizado
npm run build

# Preview do build local
npm run preview
```

---

## 📦 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção otimizado |
| `npm run build:dev` | Build em modo desenvolvimento |
| `npm run preview` | Preview local do build |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |
| `npm test` | Executa testes unitários com cobertura (mín. 75%) |
| `npm run test:no-coverage` | Executa testes sem cobertura |
| `npm run test:e2e` | Executa testes E2E com Playwright |
| `cp .env.example .env` | Configura variáveis de ambiente |

### Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|:-----------:|
| `VITE_API_URL` | URL base da API REST | ✅ |

---

## 📁 Estrutura do projeto

```
certificate-hub/
├── e2e/                          # Testes E2E (Playwright)
│   └── fluxo-completo.spec.ts   # Teste de fluxo completo
├── public/                       # Assets estáticos
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes shadcn/ui (46+)
│   │   ├── AppLayout.tsx        # Layout principal
│   │   ├── ColorPicker.tsx      # Seletor de cor
│   │   ├── ErrorAlert.tsx       # Alerta de erro
│   │   └── PageHeader.tsx       # Cabeçalho de página
│   ├── hooks/                    # Hooks customizados
│   │   └── use-mobile.tsx       # Detecção de dispositivo móvel
│   ├── lib/                      # Utilitários e configurações
│   │   ├── api.ts              # Configuração do cliente HTTP
│   │   └── utils.ts            # Funções utilitárias (cn)
│   ├── models/                   # Tipos e interfaces (Model)
│   │   ├── certificate.ts      # Certificate, isExpired
│   │   ├── envio.ts            # Envio
│   │   ├── template.ts         # Template
│   │   └── verify.ts           # Verify
│   ├── routes/                   # Rotas (TanStack Router)
│   │   ├── __root.tsx           # Layout raiz
│   │   ├── index.tsx            # Landing page
│   │   ├── verificar.tsx        # Validação pública
│   │   └── _app.*.tsx           # Rotas autenticadas
│   ├── services/                 # Camada de API
│   │   ├── api.ts              # HTTP client
│   │   └── envios.ts           # Serviço de envios
│   ├── view-models/              # Lógica de estado (ViewModel)
│   │   ├── useDashboardViewModel.ts
│   │   ├── useCertificatesViewModel.ts
│   │   ├── useEmitCertificateViewModel.ts
│   │   ├── useEnviosViewModel.ts
│   │   ├── useTemplatesViewModel.ts
│   │   └── useVerifyViewModel.ts
│   ├── views/                    # Componentes de página (View)
│   │   ├── DashboardView.tsx
│   │   ├── CertificadosListView.tsx
│   │   ├── NovoCertificadoView.tsx
│   │   ├── TemplatesView.tsx
│   │   ├── EnviosView.tsx
│   │   └── VerificarView.tsx
│   ├── main.tsx                  # Entry point
│   ├── router.tsx                # Configuração do roteador
│   ├── routeTree.ts              # Árvore de rotas
│   └── styles.css                # Estilos globais (Tailwind)
├── tests/                        # Testes unitários
├── index.html                    # HTML de entrada
├── vite.config.ts                # Configuração Vite
├── tsconfig.json                 # Configuração TypeScript
├── eslint.config.js              # Configuração ESLint
├── .prettierrc                   # Configuração Prettier
├── jest.config.cjs               # Configuração Jest
├── components.json               # Configuração shadcn/ui
└── .env.example                  # Exemplo de variáveis de ambiente
```

---

## 🧪 Testes

### Unitários (Jest + Testing Library)

```bash
# Executar todos os testes com cobertura
npm test

# Executar sem cobertura (mais rápido)
npm run test:no-coverage
```

- Cobertura mínima configurada: **75%** (instruções, branches, funções, linhas)
- Testes localizados em `tests/`, espelhando a estrutura de `src/`
- ts-jest para transformação TypeScript
- jsdom como ambiente de teste

### End-to-End (Playwright)

```bash
# Executar testes E2E
npm run test:e2e
```

- Cobertura do fluxo completo: criar template → emitir certificado → verificar
- Configuração em `e2e/playwright.config.ts`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

### Padrões de commit

Sugerimos seguir [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` refatoração de código
- `test:` adição ou alteração de testes
- `docs:` documentação
- `chore:` tarefas de manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com ❤️ por <strong>Igor Dev</strong>
</p>
