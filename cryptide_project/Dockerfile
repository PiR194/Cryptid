# Utilise une image de node.js en tant que base
FROM node:14-alpine

# Définis le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers de l'application dans le conteneur
COPY . .

# Construit l'application React
RUN npm run build

# Expose le port 80 du conteneur
EXPOSE 80

# Commande à exécuter lorsque le conteneur démarre
CMD ["npm", "start", "--", "-p", "80"]
