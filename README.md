# MYCHAT

Real time chat app.

IMG HERE

Backend: Node/express/sqlite.
Frontend: React.

Main functionalities:
Authentication
IMG HERE

Friendship
IMG HERE

Real time message exchange 
IMG HERE

## Tecnologias necessárias
- [Node.js 22.12.0 (LTS)](https://nodejs.org/pt)
- npm
- Git

## Instalação
1. Clone o repositório:
``` bash
git clone https://github.com/leobez/my-chat.git
```

2. Entre no diretório raiz do projeto
``` bash
cd my-chat
```

3. Instale as dependências:
``` bash
npm run install:all
```

4. Inicie o projeto:
``` bash
npm run start:all
```

4. Crie um arquivo .env na raiz do diretório /server e insira as linhas abaixo:

``` env
SECRET_KEY=CHAVE
```

OBS: O valor de PORT= pode ser qualquer porta que estiver disponível para você.

A API estará disponível em http://localhost:3000

### Observações  
- Certifique-se de configurar as variáveis de ambiente corretamente para rodar a API.
  
- Algumas rotas são protegidas para permitir apenas usuários autenticados.

- Algumas rotas possuem um limitador de requisições: 10 para usuários autenticados e 3 para não autenticados.
  
- Use ferramentas como Postman para testar as rotas.
  
- Caso use o Postman, é possível importar o arquivo /rest-api/postman/api-rest.postman_collection.json.
  
- A autenticação é feita através de tokens JWT salvos nos cookies da requisição. Não é necessário configurar nenhuma forma de autenticação no Postman.