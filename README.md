# dialy-diet-api
Nesse desafio desenvolveremos uma API para controle de dieta diária, a Daily Diet API.

## Configurações

Configurando a aplicação para interpretar Typescript
```
npx tsc --init
```

## Executando as migrations

Criando a tabela de usuario
```
npm run knex -- migrate:make create-user-table
```

Criando a tabela de refeição
```
npm run knex -- migrate:make create-meal-table
```

Criando as tabelas na base de dados
```
npm run knex -- migrate:latest
```