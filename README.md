# Leet Code Quest — Radar de Repositórios GitHub

Aplicação web para explorar repositórios públicos do GitHub por username, com filtros por linguagem, ordenação e estatísticas agregadas em tempo quase real.

## Funcionalidades

- **Busca por username**: informe um usuário do GitHub e visualize até 20 repositórios.
- **Filtros**: linguagem (opcional), ordenação por **estrelas** ou **nome**, ordem **asc** ou **desc**.
- **Estatísticas**: total de repositórios, total de estrelas, distribuição por linguagem e data da atualização mais recente.
- **API interna**: rotas Next.js que consomem a GitHub REST API v3, com cache em memória (60s) e tratamento de erros (404, 502, 500).
- **Interface**: layout responsivo, acessível (ARIA, labels) e tema escuro (slate/indigo/lime).

## Tecnologias

| Stack        | Tecnologia              |
|-------------|-------------------------|
| Framework   | Next.js 15 (App Router) |
| UI          | React 19, Tailwind CSS |
| Linguagem   | TypeScript 5.6         |
| Testes      | Jest (unit), Playwright (E2E) |

## Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** 9+

## Instalação

```bash
git clone <url-do-repositorio>
cd git-hub-list
npm install
```

## Scripts

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run dev`  | Sobe o servidor de desenvolvimento (padrão: `http://localhost:3000`) |
| `npm run build`| Gera o build de produção           |
| `npm run start`| Inicia o servidor em modo produção (após `build`) |
| `npm test`     | Roda os testes unitários (Jest)    |
| `npm run test:watch` | Jest em modo watch           |
| `npm run test:e2e`   | Roda os testes E2E (Playwright; sobe o app em `http://localhost:3003`) |

## Estrutura do projeto

```
git-hub-list/
├── e2e/                          # Testes E2E (Playwright)
│   └── repositories-flow.spec.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout raiz e metadata
│   │   ├── page.tsx              # Página principal (formulário + lista + stats)
│   │   ├── globals.css           # Estilos globais + Tailwind
│   │   └── repositories/
│   │       └── [username]/
│   │           ├── route.ts      # GET lista de repos (query: language, sort, order)
│   │           └── stats/
│   │               └── route.ts  # GET estatísticas do usuário
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── use-search-form.ts    # Estado do formulário e URLs da API
│   │   └── use-repositories-fetch.ts  # Fetch lista + stats em paralelo
│   ├── lib/
│   │   ├── types.ts              # RepoSummary, StatsResponse, RepoListQuery, GitHubRepo
│   │   ├── github.ts              # getReposForUser, GitHubApiError
│   │   ├── cache.ts              # Cache em memória por username
│   │   ├── transform.ts           # applyListQuery (filtro/ordenação)
│   │   └── stats.ts              # computeStats
│   └── tests/
│       └── unit/                 # Testes Jest (transform, stats, cache)
├── jest.config.js
├── playwright.config.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## API (rotas internas)

As rotas são chamadas pelo front via fetch; o front monta as URLs com o username e os query params.

### `GET /repositories/[username]`

Lista repositórios do usuário (até 20 após filtros).

**Query params:**

| Parâmetro  | Tipo     | Descrição                          |
|------------|----------|------------------------------------|
| `language` | string   | Filtro por linguagem (opcional)    |
| `sort`     | `stars` \| `name` | Ordenação (opcional)       |
| `order`    | `asc` \| `desc`  | Ordem (opcional)           |

**Respostas:** `200` (array de `RepoSummary`), `400` (username inválido), `404` (usuário não encontrado), `502` (erro da API do GitHub), `500` (erro interno).

### `GET /repositories/[username]/stats`

Estatísticas agregadas do usuário.

**Respostas:** `200` (`StatsResponse`: `total_repositories`, `total_stars`, `languages`, `most_recent_update`), `400`, `404`, `502`, `500` (mesmo padrão acima).

## Testes

- **Unitários**: `src/tests/unit/` — transform, stats, cache. Execute com `npm test`.
- **E2E**: `e2e/repositories-flow.spec.ts` — fluxo de busca, filtros e exibição de lista e stats. O Playwright sobe o app em `http://localhost:3003`. Execute com `npm run test:e2e`.

## Variáveis de ambiente

O projeto funciona sem variáveis de ambiente. A GitHub API é usada em modo público; para maior cota de requisições você pode definir (opcional):

- `GITHUB_TOKEN`: token pessoal do GitHub (não commitado; use `.env` ou `.env.local`).

O código atual não usa o token; inclua-o nos headers em `src/lib/github.ts` se quiser aumentar o rate limit.

## Licença

Projeto de estudo — uso livre.
