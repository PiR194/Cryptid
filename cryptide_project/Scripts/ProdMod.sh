#!/bin/bash


# Récupérer le répertoire du script (où que le script soit appelé)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Aller au répertoire du projet
#cd "$SCRIPT_DIR/../"

#* Lancement des serveurs
node $SCRIPT_DIR/../server/server.js &

# Attendre un court instant pour laisser le serveur démarrer
sleep 2

node $SCRIPT_DIR/../src/server/server.js &

# Attendre un court instant pour laisser le serveur démarrer
sleep 2



cd $SCRIPT_DIR/..

#* Génération de version de production
npm run build

#* Installation d'un serveur http simple
npm install -g serve

#* Execution du serveur sur le répertoire de build
serve -s build

