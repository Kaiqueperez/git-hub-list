<goal>
  Fazer a implementação de um front e uma listagem de repositorios utilizando a o backend.
</goal>

<critical>

**PARA O FRONT END DEVE UTILIZAR A SKILL  .kiro\skills\vercel-react-best-practices\SKILL.md**
**DEVE SER O MAIS PRAGMATICO POSSIVEL**
**DEVE UTILIZAR O MCP-SERVER-SKILLS**

</critical>

<description>
    Introdução
Você irá desenvolver uma API própria que consome a GitHub REST API v3 e apresenta os dados de forma customizada. O desafio é dividido em etapas, você não precisa terminar todas as tarefas.

Etapa 1 – Listar Repositórios de um Usuário
Endpoint:
GET /repositories/:username
Requisitos:
Buscar os repositórios públicos do GitHub (https://api.github.com/users/:username/repos)


Retornar até 20 repositórios com os seguintes campos:


name
url (html_url)
description
language
stars (stargazers_count)
last_update (updated_at)


Tratar erro de usuário não encontrado

Etapa 2 – Filtro por Linguagem
Adicione suporte a query string:
GET /repositories/:username?language=JavaScript
Requisitos:
Filtrar os repositórios retornados pela linguagem primária


A busca não deve ser feita novamente na API – filtre no backend

Etapa 3 – Ordenação Personalizada
Adicione suporte a:
GET /repositories/:username?sort=stars|name&order=asc|desc
Requisitos:
Permitir ordenação por:
stars
name
Com ordem ascendente ou descendente

Etapa 4 – Estatísticas dos Repositórios
Novo endpoint:
GET /repositories/:username/stats
Retorne:
{
  "total_repositories": 17,
  "total_stars": 420,
  "languages": {
    "JavaScript": 8,
    "Ruby": 3,
    "Go": 1
  },
  "most_recent_update": "2024-12-01T14:30:00Z"
}
Requisitos:
Calcular estatísticas a partir dos repositórios retornados pela API
Contar linguagens usados (considerando o campo language)

Etapa 5 – Cache Temporário
Objetivo:
Cachear o resultado da API do GitHub em memória por 60 segundos (por usuário)
Enquanto estiver no cache, não deve fazer nova chamada ao GitHub

</description>


<critical>

**PARA O FRONT END DEVE UTILIZAR A SKILL  .kiro\skills\vercel-react-best-practices\SKILL.md**
**DEVE SER O MAIS PRAGMATICO POSSIVEL**
**DEVE UTILIZAR O MCP-SERVER-SKILLS PARA FAZER O PRD**

</critical>


1. todos
2. somente username
3. confirmo
4. Monolito Next.js
5. o mais simples possivel
6. Nesse momento é so local