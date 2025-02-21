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

2. Crie um arquivo .env em /my-chat/client e coloque as seguintes variáveis
``` bash
PORT=3000


```

3. Crie um arquivo .env em /my-chat/server e coloque as seguintes variáveis
``` bash
SECRET_KEY=SECRET
PORT=3001
```

OBS: O valor de PORT= pode ser qualquer porta que estiver disponível para você.


4. Entre no diretório raiz do projeto e use o comando
``` bash
npm run install:all
```

6. Entre no diretório raiz do projeto e use o comando
``` bash
npm run start:all
```

O frontend estará disponível em http://localhost:3000

A API estará disponível em http://localhost:3001