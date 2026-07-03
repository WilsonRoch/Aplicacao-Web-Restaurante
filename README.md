# Aplicacao-Web-Restaurante

Sistema web de menu para restaurante com duas áreas:
- Área administrativa para gerenciar produtos e pedidos
- Área do cliente para visualizar o cardápio, montar carrinho e finalizar pedidos

## Tecnologias utilizadas

### Back-end
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Validation
- MySQL

### Front-end
- React
- TypeScript
- Vite
- React Query
- Axios
- CSS

## Funcionalidades da aplicação

### Área Administrativa (http://localhost:5173/?area=admin)
- Cadastrar produtos
- Editar produtos
- Excluir produtos
- Visualizar produtos
- Ativar e desativar produtos
- Visualizar pedidos
- Alterar status dos pedidos

### Área do Cliente (http://localhost:5173/?area=cliente)
- Visualizar apenas produtos ativos
- Adicionar itens ao carrinho
- Remover itens do carrinho
- Finalizar pedido
- Salvar pedido no banco de dados

## Estrutura do Projeto

- MenuRestaurante/ -> back-end Spring Boot
- MenuFrontEnd/ -> front-end React

## Configuração do Banco de Dados

O projeto utiliza MySQL.

Arquivo de configuração do back-end:
- `src/main/resources/application.properties`

Configuração principal:
- Banco: `menuRestauranteDB`
- Usuário: `root`
- Senha (definida pelo usuário): `****`
- Porta do banco (padrão): `3306`

## Executando o Back-end

1. Acesse a pasta do back-end.
2. Execute:
   - `./mvnw spring-boot:run`
   - ou `mvn spring-boot:run`

O servidor sobe em:
- `http://localhost:8080`

## Executando o Front-end

1. Acesse a pasta do front-end.
2. Instale as dependências:
   - `npm install`
3. Execute:
   - `npm run dev`

O front sobe em:
- `http://localhost:5173`

## API e Requisições

### Produtos
- `GET /produto`
- `GET /produto/{id}`
- `POST /produto`
- `PUT /produto/{id}`
- `DELETE /produto/{id}`

### Pedidos
- `GET /pedido`
- `GET /pedido/{id}`
- `POST /pedido`
- `PUT /pedido/{id}`
- `DELETE /pedido/{id}`

## Observações
- O front consome a API em `http://localhost:8080`
- Os pedidos são salvos no banco de dados, mesmo após terem sido concluídos ou cancelados
- O sistema não possui login de cliente
- O acesso da área do cliente é feito por link
