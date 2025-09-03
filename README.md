# Eat 'n' Cubes 🎮

Um simples jogo multiplayer em tempo real construído com Node.js, Express e Socket.IO. Os jogadores controlam cubos coloridos, coletam itens para ganhar pontos e competem em um placar global, tudo em tempo real.

Este projeto foi desenvolvido como parte da disciplina de Tópicos Avançados em Desenvolvimento de Sistemas.

---

## 🕹️ Jogue Agora!

A versão ao vivo do jogo está hospedada na Vercel. Acesse pelo link abaixo:

**[Clique aqui para jogar!](https://eat-n-cubes.vercel.app/)**

---

## ✨ Funcionalidades

-   **[x] Multiplayer em Tempo Real:** Jogue com múltiplos jogadores conectados ao mesmo servidor.
-   **[x] Personalização:** Escolha seu nome e cor antes de entrar na partida.
-   **[x] Sistema de Pontuação:** Colete itens que aparecem aleatoriamente no mapa para aumentar sua pontuação.
-   **[x] Placar Global:** Acompanhe a pontuação de todos os jogadores em tempo real.
-   **[x] Colisões:** Jogadores não podem atravessar as paredes do mapa nem outros jogadores.
-   **[x] Sincronização Eficiente:** O servidor envia apenas as atualizações necessárias para os clientes (delta updates).
-   **[x] Notificações de Conexão:** Mensagens de entrada e saída de jogadores são exibidas no chat.

---

## 🚀 Tecnologias Utilizadas

-   **Backend:** Node.js, Express.js
-   **Comunicação em Tempo Real:** Socket.IO
-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
-   **Hospedagem:** Vercel

---

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
-   [Git](https://git-scm.com)
-   [Node.js (versão 18 ou superior)](https://nodejs.org)
-   npm (geralmente já vem instalado com o Node.js)

---

## ⚙️ Rodando o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto na sua máquina.

**1. Clone o repositório:**
Abra seu terminal e use o comando abaixo para clonar o projeto.

```bash
git clone [https://github.com/RaulNeto-2810/Eat_-n-_Cubes-TA-2025](https://github.com/RaulNeto-2810/Eat_-n-_Cubes-TA-2025)
```

**2. Acesse a pasta do projeto:**

```bash
cd eat-n-cubes
```

**3. Instale as dependências:**
Este comando irá ler o arquivo package.json e instalar todas as bibliotecas necessárias (Express e Socket.IO).

```bash
npm install
```

**4. Inicie o servidor:**
Este comando executa o script "start" definido no package.json, que por sua vez inicia o server.js.

```bash
node server.js
```

**5. Acesse o jogo:**
Após o passo anterior, o servidor estará rodando. Abra seu navegador e acesse a seguinte URL:

http://localhost:3000

Para testar o modo multiplayer, você pode abrir o mesmo link em várias abas ou janelas do navegador.

--- 

## 🎮 Como Jogar

- Acesse o jogo: Abra o link da Vercel ou o localhost:3000.
- Identifique-se: Na tela inicial, digite um apelido e escolha a cor do seu cubo.
- Jogue: Clique em "Jogar!". Você será levado para a arena.
- Movimente-se: Use as teclas de seta do seu teclado para controlar o seu cubo.
- Pontue: Colete os itens dourados que aparecem no mapa para aumentar sua pontuação.