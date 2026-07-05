<div align="center">
  <h1>Certificate Hub</h1>
  <p>
    <strong>Interface web para emissão, gestão e validação de certificados digitais.</strong>
  </p>
  <p>
    Frontend do <a href="https://github.com/igordev23/certificate-server">Certificate Server</a>.
    Consome a API REST para gerenciar templates, emitir certificados e disponibilizar verificação pública.
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7">
    <img src="https://img.shields.io/badge/TanStack_Router-1.168-FF4154?logo=reactrouter&logoColor=white" alt="TanStack Router">
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
    <img src="https://img.shields.io/badge/shadcn/ui-latest-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui">
    <img src="https://img.shields.io/badge/version-0.1.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</div>

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Desenvolvimento](#-desenvolvimento)
- [Roadmap](#-roadmap)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🧭 Visão Geral

O **Certificate Hub** é o frontend oficial do ecossistema Certificate Server. Ele fornece uma interface web para instituições de ensino, empresas e organizações gerenciarem certificados digitais de forma prática.

O projeto foi construído com React 19, TypeScript e TanStack Router, adotando uma **arquitetura em camadas** que separa responsabilidades entre views, lógica de estado (view-models), serviços HTTP e modelos de domínio.

> ⚠️ **MVP** — Este é um produto mínimo viável. Ainda não há autenticação implementada; todas as rotas são públicas.

### Screenshot

<div align="center">
  <img src="/public/screenshot.png" alt="Certificate Hub - Landing Page" width="800" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  <p><em>Landing page do Certificate Hub</em></p>
</div>

---

## ⚙️ Funcionalidades

| Funcionalidade               | Descrição                                                                |
| ---------------------------- | ------------------------------------------------------------------------ |
| **Gestão de Certificados**   | Emissão, listagem, edição e cancelamento de certificados                 |
| **Templates Personalizados** | CRUD de templates com layout configurável (cores, fontes, bordas)        |
| **Dashboard**                | Visão geral com métricas, gráficos (Recharts) e acompanhamento de envios |
| **Verificação Pública**      | Página aberta para validação de autenticidade via CPF + código           |
| **UI Componentizada**        | shadcn/ui + Radix UI com mais de 46 primitivas acessíveis                |
| **Formulários Validados**    | react-hook-form + Zod com schemas tipados                                |
| **Testes Automatizados**     | Testes unitários (Jest + Testing Library) e E2E (Playwright)             |

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura em camadas** com React:

```
src/
├── models/        # Tipos e interfaces (Certificate, Template, Envio, Verify)
├── services/      # Comunicação HTTP com a API
├── view-models/   # Hooks de estado e lógica de negócio
├── views/         # Componentes de página (View)
├── hooks/         # Hooks customizados genéricos
├── components/    # Componentes reutilizáveis (incl. shadcn/ui)
├── lib/           # Utilitários e configurações
└── routes/        # Definição de rotas (TanStack Router file-based)
```

### Fluxo de dados

1. `Route` → carrega `View`
2. `View` → consome `ViewModel` (hooks TanStack Query)
3. `ViewModel` → usa `Service` para comunicação HTTP
4. `Service` → retorna dados tipados (`Model`)
5. `TanStack Query` → gerencia cache, loading states e mutations

### Rotas

| Rota                       | Descrição                        |
| -------------------------- | -------------------------------- |
| `/`                        | Landing page                     |
| `/dashboard`               | Dashboard com métricas           |
| `/certificados`            | Listagem de certificados         |
| `/certificados/novo`       | Emitir novo certificado          |
| `/certificados/:id/editar` | Editar certificado               |
| `/templates`               | Listagem de templates            |
| `/templates/:id/edit`      | Editar template                  |
| `/envios`                  | Gerenciar envios                 |
| `/verificar`               | Validação pública de certificado |

---

## 🛠️ Stack Tecnológico

| Tecnologia          | Versão | Finalidade                                     |
| ------------------- | ------ | ---------------------------------------------- |
| **React**           | 19     | Biblioteca de UI                               |
| **TypeScript**      | 5.8    | Linguagem com tipagem estática                 |
| **Vite**            | 7      | Bundler e servidor de desenvolvimento          |
| **TanStack Router** | 1.168  | Roteamento type-safe (file-based)              |
| **TanStack Query**  | 5      | Gerenciamento de estado do servidor            |
| **Tailwind CSS**    | 4      | Estilização utilitária                         |
| **shadcn/ui**       | —      | Componentes de interface (Radix UI + Tailwind) |
| **React Hook Form** | 7      | Gerenciamento de formulários                   |
| **Zod**             | 3      | Validação de schemas                           |
| **Recharts**        | 2      | Gráficos e visualização de dados               |
| **date-fns**        | 4      | Manipulação de datas                           |
| **Lucide React**    | —      | Ícones                                         |
| **qrcode**          | 1.5    | Geração de QR Codes no servidor (PDF)          |
| **qrcode.react**    | 4      | Renderização de QR Codes no navegador          |
| **Sonner**          | 2      | Notificações toast                             |
| **Jest**            | 30     | Testes unitários                               |
| **Testing Library** | 16     | Testes de componentes React                    |
| **Playwright**      | 1      | Testes E2E                                     |
| **ESLint**          | 9      | Análise estática                               |
| **Prettier**        | 3      | Formatação de código                           |

---

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm** 9+ (ou bun)
- **Certificate Server** rodando (API) — veja o [repositório oficial](https://github.com/igordev23/certificate-server)

---

## 🚀 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/igordev23/certificate-hub.git
cd certificate-hub

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API:
# VITE_API_URL=http://localhost:3000

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em **http://localhost:5173**.

### Build de produção

```bash
npm run build
npm run preview
```

---

## 🔐 Variáveis de Ambiente

| Variável       | Obrigatória | Descrição                                  |
| -------------- | ----------- | ------------------------------------------ |
| `VITE_API_URL` | ✅          | URL base da API REST do Certificate Server |

### Arquivo `.env` de exemplo

```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ **Nunca** commite o arquivo `.env`. Apenas o `.env.example` (com valor vazio) deve ser versionado.

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
npm run test:e2e
```

- Fluxo completo: criar template → emitir certificado → verificar
- Configuração em `e2e/playwright.config.ts`

---

## 📁 Estrutura do Projeto

```
certificate-hub/
├── e2e/                          # Testes E2E (Playwright)
│   └── fluxo-completo.spec.ts
├── public/                       # Assets estáticos
│   └── screenshot.png           # Screenshot do projeto
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                  # shadcn/ui (46+ componentes)
│   │   ├── AppLayout.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── ErrorAlert.tsx
│   │   └── PageHeader.tsx
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── api.ts               # Cliente HTTP
│   │   └── utils.ts             # cn() e utilitários
│   ├── models/                   # Tipos e interfaces
│   │   ├── certificate.ts
│   │   ├── envio.ts
│   │   ├── template.ts
│   │   └── verify.ts
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── verificar.tsx
│   │   └── _app.*.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── envios.ts
│   ├── view-models/
│   │   ├── useCertificatesViewModel.ts
│   │   ├── useDashboardViewModel.ts
│   │   ├── useEmitCertificateViewModel.ts
│   │   ├── useEnviosViewModel.ts
│   │   ├── useTemplatesViewModel.ts
│   │   └── useVerifyViewModel.ts
│   ├── views/
│   │   ├── CertificadosListView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── EnviosView.tsx
│   │   ├── NovoCertificadoView.tsx
│   │   ├── TemplatesView.tsx
│   │   └── VerificarView.tsx
│   ├── main.tsx
│   ├── router.tsx
│   ├── routeTree.ts
│   └── styles.css
├── tests/                        # Testes unitários
├── index.html
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── jest.config.cjs
├── components.json
└── .env.example
```

---

## 💻 Desenvolvimento

### Comandos úteis

| Comando                    | Descrição                              |
| -------------------------- | -------------------------------------- |
| `npm run dev`              | Inicia servidor de desenvolvimento     |
| `npm run build`            | Compila para produção                  |
| `npm run build:dev`        | Build em modo desenvolvimento          |
| `npm run preview`          | Preview local do build                 |
| `npm run lint`             | Verifica código com ESLint             |
| `npm run format`           | Formata código com Prettier            |
| `npm test`                 | Executa testes unitários com cobertura |
| `npm run test:no-coverage` | Testes sem cobertura                   |
| `npm run test:e2e`         | Testes E2E com Playwright              |

### Convenções de código

- **TypeScript** estrito — tipos explícitos em todas as interfaces públicas
- **Arquitetura em camadas** — imports seguem direção: View → ViewModel → Service → Model
- **Componentes shadcn/ui** — personalizados via `className` com Tailwind
- **Nomes descritivos** — componentes, hooks e arquivos com nomes que refletem sua responsabilidade
- **Testes espelhados** — `tests/` segue a mesma estrutura de `src/`

---

## 🗺️ Roadmap

Funcionalidades planejadas para versões futuras:

- [ ] **Autenticação** — Proteger rotas administrativas com login JWT
- [ ] **Emissão em Lote** — Upload de CSV para emitir múltiplos certificados de uma vez
- [ ] **Envio por E-mail** — Disparo automático do PDF por e-mail ao emitir
- [ ] **Upload de Logo** — Upload de logotipo personalizado por template
- [ ] **Modo Escuro** — Tema dark com Tailwind CSS
- [ ] **PWA** — Suporte a aplicação web progressiva para uso offline parcial

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Igor** — _Desenvolvimento e Arquitetura_
