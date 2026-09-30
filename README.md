# Rotine

Projeto Node.js com Prisma ORM 7 para estruturar o acesso a um banco MySQL/MariaDB. O schema atual descreve usuários e produtos associados a cada usuário.

## Estado atual

O repositório contém o schema Prisma, uma migração inicial e a configuração do adapter MariaDB. Ainda não há `app.js`, embora os scripts `start` e `dev` em `package.json` apontem para esse arquivo. Portanto, esses scripts não iniciam uma aplicação neste momento. Também não há endpoints, interface, testes automatizados ou script de seed configurados.

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

Após alterações no schema, gere novamente o Prisma Client. A saída configurada pelo generator é `generated/prisma/`, diretório ignorado pelo Git.

## Modelo de dados

### `Usuario`

- `id`: identificador inteiro autoincremental.
- `nome`: nome do usuário.
- `email`: e-mail único.
- `senha`: senha armazenada como texto no modelo atual.
- `produtos`: relação para os produtos pertencentes ao usuário.

### `Produto`

- `id`: identificador inteiro autoincremental.
- `nome`: nome do produto.
- `preco`: preço numérico (`Float` no schema atual).
- `usuarioId`: chave estrangeira para `Usuario`.
- `usuario`: relação com o usuário proprietário.

A migração inicial cria uma relação obrigatória de `Produto` para `Usuario`. A exclusão de um usuário que ainda tenha produtos é restringida pelo banco.

## Estrutura principal

```text
.
├── package.json             # Dependências e scripts npm
├── prisma7.config.ts        # Configuração do Prisma CLI e DATABASE_URL
└── prisma/
    ├── schema.prisma        # Modelos e geração do Prisma Client
    ├── prisma.js            # Inicialização do Prisma Client com adapter MariaDB
    └── migrations/          # Histórico de migrações SQL
```

## Observações de implementação

- Os scripts `npm start` e `npm run dev` só funcionarão depois que `app.js` for criado.
- O schema gera o client em `generated/prisma`, enquanto `prisma/prisma.js` importa `PrismaClient` de `@prisma/client`. Antes de usar esse helper, alinhe o import com o diretório gerado ou ajuste a configuração do generator.
- O campo `senha` está definido como texto simples no schema. Uma aplicação que implemente autenticação deve armazenar hashes seguros, nunca senhas em texto puro.
- Não há comandos de teste ou seed definidos em `package.json` neste momento.