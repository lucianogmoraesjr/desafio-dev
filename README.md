# 💰 psa.finance - Desafio Técnico Fullstack

Uma aplicação completa para gestão financeira pessoal. Permite aos usuários o controle de suas contas bancárias, categorização de receitas e despesas, e o acompanhamento do saldo em tempo real.

🌐 **Acesse a aplicação em produção:**

- **Frontend (UI):** [https://desafio-dev-psa.vercel.app/](https://desafio-dev-psa.vercel.app/)
- **Documentação da API (Scalar):** [https://desafio-dev-production.up.railway.app/docs](https://desafio-dev-production.up.railway.app/docs)

---

## 🚀 Tecnologias Utilizadas

**Backend (`/api`)**

- [NestJS](https://nestjs.com/) (Framework Node.js com arquitetura modular)
- [Fastify](https://fastify.dev/) (Motor HTTP de alta performance)
- [Prisma ORM](https://www.prisma.io/) & PostgreSQL (Modelagem e persistência de dados)
- [Swagger / Scalar](https://scalar.com/) (Documentação interativa da API baseada em OpenAPI)

**Frontend (`/ui`)**

- [Next.js](https://nextjs.org/) (React Framework moderno)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização baseada em utilitários)

---

## ⚙️ Como executar o projeto localmente

Pensando na Experiência do Desenvolvedor (DX) e para facilitar a avaliação, o projeto é totalmente containerizado. Você não precisa instalar Node.js ou configurar bancos de dados manualmente na sua máquina.

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (ou Podman) instalados.

### Passo a passo

1. Clone o repositório:

```bash
   git clone https://github.com/lucianogmoraesjr/desafio-dev.git
   cd desafio-dev

```

2. Suba toda a infraestrutura (Banco de Dados, Backend e Frontend) com um único comando:

```bash
   docker compose up -d --build

```

3. Acesse localmente:

- **Aplicação Web:** [http://localhost:3000](http://localhost:3000)
- **Swagger / Docs:** [http://localhost:3001/docs](http://localhost:3001/docs)

---


## 📖 Documentação da API

A documentação interativa detalha todos os contratos de endpoints, DTOs e códigos de resposta HTTP.

Se estiver testando pelo ambiente local ou em produção (`/docs`), o fluxo para rotas privadas é:

1. Cadastre uma conta em `POST /auth/signup` (ou utilize o usuário de testes).
2. Autentique-se em `POST /auth/signin` para obter o `accessToken`.
3. Insira o token no botão de **Authorize** da interface para desbloquear as rotas privadas.

---

## 🏛️ Decisões Arquiteturais e Boas Práticas

- **Separação de Domínios:** O backend segue uma estrutura modular rígida (`auth`, `users`, `bank-accounts`, `categories`, `transactions`), isolando regras de negócio e serviços.
- **Validação de Entradas:** Uso intensivo de `class-validator` e `class-transformer` nos DTOs para blindar a API contra payloads malformados.
- **Containerização Eficiente:** Dockerfiles otimizados com _Multi-stage builds_ e Alpine Linux para manter as imagens leves e seguras.

---

## 👨‍💻 Desenvolvido por

Luciano Guimarães Moraes Junior
