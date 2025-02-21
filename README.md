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

2. Entre no diretório /my-chat/client do projeto
``` bash
cd /my-chat/client
```

3. Crie um arquivo .env em /my-chat/client e coloque as seguintes variáveis
``` bash
PORT=3000
```

4. Crie um arquivo .env em /my-chat/server e coloque as seguintes variáveis
``` bash
SECRET_KEY=SECRET
PORT=3001
```

OBS: O valor de PORT= pode ser qualquer porta que estiver disponível para você.


5. Entre no diretório raiz do projeto e use o comando
``` bash
npm run install:all
```

6. Entre no diretório raiz do projeto e use o comando
``` bash
npm run start:all
```

O frontend estará disponível em http://localhost:3000

A API estará disponível em http://localhost:3001

### Observações  
- Certifique-se de configurar as variáveis de ambiente corretamente para rodar a aplicação.
- Algumas rotas são protegidas para permitir apenas usuários autenticados.
- Algumas rotas possuem um limitador de requisições: 10 para usuários autenticados e 3 para não autenticados.
- Use ferramentas como Postman para testar as rotas.
- Caso use o Postman, é possível importar o arquivo /rest-api/postman/api-rest.postman_collection.json.
- A autenticação é feita através de tokens JWT salvos nos cookies da requisição. Não é necessário configurar nenhuma forma de autenticação no Postman.