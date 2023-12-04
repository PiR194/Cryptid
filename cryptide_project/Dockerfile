# Utiliser une image Node.js avec la version souhaitée
FROM node:14

# Créer le répertoire de travail dans l'image
WORKDIR /app

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers de l'application dans l'image
COPY . .

# Construire l'application React
RUN npm run build

COPY serve.json build/

# Exposer le port sur lequel le serveur va écouter
EXPOSE 8080

# Installer le serveur "serve" de manière globale
RUN npm install -g serve

# Commande pour démarrer le serveur lorsque le conteneur est lancé
CMD ["serve", "-s", "build", "-l", "8080", "--config", "serve.json"]
