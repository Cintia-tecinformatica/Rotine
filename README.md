# Rotine

Projeto Node.js com Prisma ORM 7 e Express. A API usa MySQL/MariaDB para armazenar usuários e tarefas.
O Rotine é uma API REST para ajudar usuários a organizar suas tarefas. Oferece cadastro e autenticação de usuários, além de recursos para criar, consultar e atualizar tarefas com status, prioridade e prazo. Desenvolvida com Node.js e Express, utiliza Prisma ORM 7 e MySQL/MariaDB para persistir os dados.
## Estado atual

A aplicação Express é iniciada por `server.js`. Ela disponibiliza rotas de autenticação em `/auth` e de tarefas em `/tasks`.

## Requisitos

- Node.js 20.19 ou superior
- MySQL ou MariaDB acessível pela aplicação
- npm

## Instalação e configuração

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz. O arquivo é ignorado pelo Git. Informe a URL usada pelo Prisma CLI e os dados separados usados pelo adapter da aplicação:

```dotenv
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
DATABASE_HOST="localhost"
DATABASE_USER="USUARIO"
DATABASE_PASSWORD="SENHA"
DATABASE_NAME="NOME_DO_BANCO"
```

Crie o banco de dados no servidor antes de aplicar a migração. Se a senha contiver caracteres especiais, eles devem estar codificados corretamente na `DATABASE_URL`.

Gere o Prisma Client antes de iniciar a API:

```bash
npx prisma generate --config prisma7.config.ts
npm run dev
```

O cliente gerado não é versionado. Se `ERR_MODULE_NOT_FOUND` mencionar `src/generated/client.ts`, gere o cliente com o comando acima. Se mencionar um pacote como `express`, instale as dependências com `npm install`.

## Prisma

A configuração do CLI está em `prisma7.config.ts` (não no nome padrão `prisma.config.ts`), por isso os comandos abaixo informam o arquivo explicitamente.

Valide o schema:

```bash
npx prisma validate --config prisma7.config.ts
```

Gere o Prisma Client:

```bash
npx prisma generate --config prisma7.config.ts
```

Aplique as migrações pendentes no ambiente de desenvolvimento:

```bash
npx prisma migrate dev --config prisma7.config.ts
```

Em um ambiente de produção, aplique as migrações já versionadas com:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

Após alterações no schema, gere novamente o Prisma Client. A saída configurada pelo generator é `src/generated/`, diretório ignorado pelo Git.

## Modelo de dados

### `User`

- `id`: identificador inteiro autoincremental.
- `name`: nome do usuário.
- `email`: e-mail único.
- `password`: senha do usuário.
- `tasks`: relação com as tarefas do usuário.

### `Task`

- `id`: identificador inteiro autoincremental.
- `title`, `description`: título e descrição opcional.
- `status`, `priority`: estado e prioridade da tarefa.
- `dueDate`: prazo opcional.
- `userId`: chave estrangeira para `User`.

Cada tarefa pertence a um usuário e é removida quando esse usuário é excluído.

## Estrutura principal

```text
.
├── package.json             # Dependências e scripts npm
├── server.js                # Inicialização da API Express
├── prisma7.config.ts        # Configuração do Prisma CLI e DATABASE_URL
└── prisma/
    ├── schema.prisma        # Modelos e geração do Prisma Client
    └── migrations/          # Histórico de migrações SQL
└── src/
    ├── prisma.js            # Inicialização do Prisma Client com adapter MariaDB
    ├── routes/              # Rotas de autenticação e tarefas
    ├── controllers/
    ├── services/
    └── middlewares/
```

## Observações de implementação

- Os scripts `npm start` e `npm run dev` iniciam `server.js`.
- O schema gera o client em `src/generated`, importado por `src/prisma.js`.
- O serviço de usuários usa `bcryptjs` para processar senhas.
- Não há comandos de teste ou seed definidos em `package.json` neste momento.