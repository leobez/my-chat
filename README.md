# MYCHAT

Real time chat app.

IMG HERE

Backend: Node/express/sqlite.
Frontend: React/redux.

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

2. Entre na raiz do repositório e instale as dependências
``` bash
cd my-chat
npm run install:all
```

3. Crie um arquivo .env em /my-chat/client, coloque as seguintes variáveis
``` bash
PORT=3000
VITE_BASE_API_URL=http://localhost:3001/api
```

4. Crie um arquivo .env em /my-chat/server e coloque as seguintes variáveis e inicialize
``` bash
SECRET_KEY=SECRET
PORT=3001
ALLOWED_ORIGIN=http://localhost:3000
```

6. Volte para o dietório raiz do projeto e use o comando
``` bash
cd my-chat
npm run start:all
```

O frontend estará disponível em http://localhost:3000
A API estará disponível em http://localhost:3001

Entidades
User
Message
Friendship
Group
GroupMessage
Membership