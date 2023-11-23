## Présentation : 

Vous êtes plusieurs enquêteur sur une affaire, vous avez sous vos yeux un réseau de personne se connaissant plus ou moins entre eux.  
Au cours de cette palpitante partie, vous allez devoir questionner vos adversaires afin de deviner leur indice et être le premier  
inspecteur à trouver le coupable.

## Comment utiliser notre projet :

Cette partie va vous permettre de récupérer le projet sur votre poste et de faire les configurations nécéssaire afin de pouvoir jouer en  
local avec vos amis, des ORDIs, etc.

*Prérequis :* Avoir git et npm sur son poste.

### Récupérer le projet  
Dans un premier terminal vous allez faire les commandes suivantes :  
```
    git clone https://codefirst.iut.uca.fr/git/Crypteam/Cryptid.git
    cd cryptide_project
```
Ensuite installer les dépendances de celui-ci :  
```
    npm i --force
```

### Configurer le réseau  
Il va falloir commencer par faire un partage de connexion de votre téléphone à votre ordinateur.  

Ensuite il va falloir récupérer votre adresse IP :

#### Windows

- Ouvrez l'invite de commandes (`cmd`) et tapez la commande `ipconfig`. Repérez la section de votre connexion sans fil et notez l'adresse IPv4.

#### MacOS / Linux

- Ouvrez le terminal et tapez la commande `ifconfig` ou `ip addr`. Recherchez la section de votre connexion sans fil et notez l'adresse IP.

A présent on va configurer Socket.IO dans `SocketConfig.ts`

1. **Ouvrez le fichier `SocketConfig.ts` :**
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

### Démarrer les serveurs  
Vous allez pouvoir ouvrir un second terminal pour ouvrir le serveur Socket.IO qui va gérer, entre autres, le déroulement de la partie.
```
    cd ./server
    node server.js
```

Maintenant, ouvrez un troisième et dernier terminal pour le serveur gérant l'API  
```
    cd ./src/server
    node server.js
```