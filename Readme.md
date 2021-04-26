### Executar localmente

- Configurar acesso ao banco de dados em **ormconfig.json**
```json
  ...
  "username": "exemplo",
  "password": "exemplo",
  "database": "database_name"
}
```

- Criar banco de dados, caso ainda não exista
```shell
  $ mysql -u root -p -e 'create database database_name'
```

- Instalar dependencias, executar migrations do banco de dados e executar api
```shell
  $ yarn install
  $ yarn typeorm migration:run
  $ yarn dev
```

- Acessar página do chat
  - http://localhost:3000/pages/client

