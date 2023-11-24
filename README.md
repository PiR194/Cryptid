# Présentation : 

Vous êtes plusieurs enquêteur sur une affaire, vous avez sous vos yeux un réseau de personne se connaissant plus ou moins entre eux. Au cours de cette palpitante partie, vous allez devoir questionner vos adversaires afin de deviner leur indice et être le premier inspecteur à trouver le coupable.

## Comment utiliser notre projet :

*Prérequis :* Avoir git et npm sur son poste.

### Etape 1 : Récupérer le projet  
Dans un premier terminal, exécutez les commandes suivantes :  
```bash
    git clone https://codefirst.iut.uca.fr/git/Crypteam/Cryptid.git
    cd cryptide_project
    npm i --force
```

### Etape 2 : Configurer le réseau  

1. Faites un partage de connexion de votre téléphone à votre ordinateur.  

2. Récupérez votre adresse IP :

Sur Windows
- Ouvrez l'invite de commandes (`cmd`) et tapez la commande `ipconfig`. Repérez la section de votre connexion sans fil et notez l'adresse IPv4.

Sur MacOS / Linux
- Ouvrez le terminal et tapez la commande `ifconfig` ou `ip addr`. Recherchez la section de votre connexion sans fil et notez l'adresse IP.

### Etape 3 : Configurer Socket.IO

1. **Ouvrez le fichier `./src/SocketConfig.ts` :**
   - Localisez le fichier dans le répertoire de votre application.

2. **Modifiez l'adresse IP dans la ligne `const socket = io(...)` :**
   - Remplacez l'adresse IP existante par celle que vous avez notée à l'étape 2.

   Exemple :
   ```typescript
   //SocketConfig.ts
   import { io } from "socket.io-client";

   // Remplacez "http://172.20.10.4:3002" par votre propre adresse IP
   const socket = io("http://VOTRE_ADRESSE_IP:3002");

   export { socket };
   ```

### Etape 4 : Démarrer les serveurs  
Dans un second terminal, ouvrez le serveur Socket.IO :
```bash
    cd ./server
    node server.js
```

Dans un troisième ouvrez le serveur gérant l'API  
```bash
    cd ./src/server
    node server.js
```

### Etape 5 : Démarrer l'application 

1. Revenez dans le premier terminal et exécutez la commande suivante :
```bash
    npm start
```

2. L'application va s'ouvrir dans votre navigateur et vous pouvez jouez à notre jeu.

### Etape bonus : Jouez avec ces amis

1. Sur la première page de l'application, cliquez sur **Jouez** > **Créer une partie**.
2. Une fois dans le lobby, **copiez le lien** de la partie et l'envoyez à vos amis.
3. Lancez la partie et **amusez-vous** !