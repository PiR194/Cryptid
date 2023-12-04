# Utilisez une image Node.js comme base
FROM node:14-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et le fichier package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tous les fichiers de l'application dans le répertoire de travail
COPY . .

# Exposez le port 8080
EXPOSE 8080

# Commande pour exécuter l'application lorsque le conteneur démarre
CMD ["npm", "start"]
