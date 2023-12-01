(:construction: ***Le readme n'est pas a sa version final et est susceptible de changer*** :construction:)

# Présentation : 

Bienvenue dans notre jeu de déduction captivant, où l'intrigue et la malice se rejoignent dans une aventure palpitante ! Plongez-vous dans un monde de mystère et d'intrigue, où chaque interaction compte, et chaque indice vous rapproche de la vérité.Imaginez un graphique complexe où chaque sommet représente une personne, chaque axe une relation, et chaque détail compte. Vous êtes plongé dans un défi stimulant pour découvrir qui parmi ces individus est le mystérieux tueur. Chaque joueur détient un indice crucial, et seul le partage stratégique de ces indices vous mènera à la résolution du mystère. Explorez notre page de règles pour comprendre les subtilités du jeu, découvrez les indices qui peuvent vous guider, et élaborez des stratégies intelligentes pour identifier le coupable. Manipuler vos amis, afin d'être le premier à découvrir qui est le meurtrier ! Êtes-vous prêt à relever le défi et à démasquer le tueur caché dans le graphe ? Que l'enquête commence !

## Comment utiliser notre projet :

*Prérequis :* Avoir **git** et **npm** (et donc **Node.js**) sur son poste.

### Etape 1 : Récupérer le projet  
Dans un premier terminal, exécutez les commandes suivantes :  
```bash
    git clone https://codefirst.iut.uca.fr/git/Crypteam/Cryptid.git
    cd cryptide_project
    npm i --force
```

### Etape 2 : Configurer le réseau  

1. Pour jouer en distant, vous devez vous trouver sur le même réseau. (Il faut quand même éviter les réseaux tels qu' eduroam)

2. Récupérez votre adresse IP :

Sur **Windows**
> - Ouvrez l'invite de commandes (`cmd`) et tapez la commande `ipconfig`. Repérez la section de votre connexion sans fil et notez l'adresse IPv4.

Sur **MacOS** / **Linux**
> - Ouvrez le terminal et tapez la commande `ifconfig` ou `ip addr`. Recherchez la section de votre connexion sans fil et notez l'adresse IP.

### Etape 3 : Configurer les serveurs

1. **Ouvrez le fichier `./src/AdressSetup.ts` :**
   - Localisez le fichier dans le répertoire de votre application.

2. **Modifiez l'adresse des serveurs :**
   - Remplacez les adresses IP existantes par celle que vous avez notée à l'étape 2.

   Exemple :
   ```typescript
        // ./AdressSetup.ts
        const ADRESSE_WEBSERVER = "http://{VOTRE_IP}:3002"
        const ADRESSE_DBSERVER = "http://{VOTRE_IP}:3003"
        const ADRESSE_WEBSITE = ""
        
        export {ADRESSE_DBSERVER, ADRESSE_WEBSERVER, ADRESSE_WEBSITE}
   ```

3.  **Ouvrez le fichier `./server/server.js` :**
    - Localisez le fichier dans le répertoire de votre application.

4.  **Modifiez les adresses qui peuvent accèder aux serveurs :**
    - Ajoutez votre adresse notée à l'étape 2 dans le cors.

    Exemple :
    ```typescript
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server, {
            cors: {
                origin: ["http://{VOTRE_IP}:3000", "http://localhost:3000"], // Remplacez par l'URL de votre application React
                methods: ["GET", "POST"],
                credentials: true
            }
        });
    ```

5. **Apportez la même modification au fichier `./src/server/server.js` :**
- Une fois le fichier ouvert, appuyez-vous sur l'exemple précédent pour apporter les modifications necéssaire.

### Etape 4 : Démarrer les serveurs

1. **Ouvrez un second terminal :**
- Exécutez le script `./startServer.sh`.

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


# ::construction_worker:: Développeurs

- Thomas Chazot : thomas.chazot@etu.uca.fr
- Pierre Ferreira : pierre.ferreira@etu.uca.fr
- Baptiste Marcel : baptise.marcel@etu.uca.fr

<div align="center">
<a href = "https://codefirst.iut.uca.fr/git/thomas.chazot2">
<img src="https://codefirst.iut.uca.fr/git/avatars/4ce5054250e693b04367d853b3c469b1?size=870" width="50" >
</a>
<a href = "https://codefirst.iut.uca.fr/git/pierre.ferreira">
<img src="https://codefirst.iut.uca.fr/git/avatars/edbacace5f621ae77077f206ebdcee27?size=870" width="50" >
</a>
<a href = "https://codefirst.iut.uca.fr/git/baptiste.marcel">
<img src="https://codefirst.iut.uca.fr/git/avatars/6b1f2a8b8f636d8f4d315b060075578f?size=870" width="50" >
</a>

© IUT - Auvergne
</div>