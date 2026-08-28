# 💰 psa.finance - Desafio Técnico

Uma aplicação completa (Fullstack) para gestão financeira pessoal. Permite aos usuários o controle de suas contas bancárias, categorização de despesas e receitas, e o acompanhamento do saldo em tempo real.

---

## 🚀 Tecnologias Utilizadas

**Backend (`/api`)**

- [NestJS](https://nestjs.com/) (Framework Node.js)
- [Fastify](https://fastify.dev/) (Motor HTTP de alta performance)
- [Prisma ORM](https://www.prisma.io/) (Modelagem de dados e Migrations)
- [PostgreSQL](https://www.postgresql.org/) (Banco de Dados Relacional)
- [Swagger / Scalar](https://scalar.com/) (Documentação interativa da API)

**Frontend (`/ui`)**

- [Next.js](https://nextjs.org/) (React Framework)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização utilitária)
- Integração via API REST

---

## ⚙️ Como executar o projeto

Pensando em facilitar a avaliação, o projeto foi totalmente containerizado. Você não precisa instalar Node.js ou configurar bancos de dados localmente.

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Passo a passo

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/seu-usuario/desafio-dev.git
   cd desafio-dev
   \`\`\`

2. Suba toda a infraestrutura (Banco de Dados, Backend e Frontend) com um único comando:
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

3. Acesse a aplicação:
   - **Frontend (UI):** [http://localhost:3000](http://localhost:3000)
   - **Documentação da API:** [http://localhost:3001/docs](http://localhost:3001/docs)

> **Nota:** As migrações do banco de dados são executadas automaticamente durante a inicialização do container da API.

---

## 📖 Documentação da API

A documentação completa dos endpoints, regras de negócio e payloads (DTOs) foi construída utilizando o Scalar (uma interface mais moderna para o padrão OpenAPI/Swagger).

Para testar a API diretamente pela documentação:

1. Acesse `http://localhost:3001/docs`.
2. Utilize o endpoint `POST /auth/signup` para criar um usuário.
3. Utilize o endpoint `POST /auth/signin` para obter o Token JWT.
4. Clique no botão de **Autenticação** no painel e insira o Token para desbloquear as rotas privadas.

---

## 🏛️ Estrutura do Projeto e Decisões Arquiteturais

O projeto adota princípios de separação de responsabilidades e injeção de dependências para garantir uma base de código escalável e testável.

- **`/api/src/modules`**: Divisão por domínio (Auth, Users, BankAccounts, Categories, Transactions).
- **`/api/src/shared`**: Decorators, providers e lógicas compartilhadas globalmente.
- **Validação**: Uso intensivo de `class-validator` e `class-transformer` nos DTOs para blindar a aplicação de entradas inválidas.
- **Respostas HTTP**: Padronização dos retornos e dos HTTP Status Codes (200, 201, 204, 400, 401, 404, 409).

---

## 👨‍💻 Desenvolvido por

Luciano Guimarães Moraes Junior
