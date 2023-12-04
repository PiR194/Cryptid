# Utilisation d'une image de Node.js avec Alpine Linux comme système d'exploitation de base
FROM node:14-alpine as builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet dans le conteneur
COPY . .

# Construire l'application React
RUN npm run build

# Utiliser une image légère basée sur Node.js pour servir l'application avec serve
FROM node:14-alpine

# Installer serve globalement
RUN npm install -g serve

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers construits à partir du builder vers le répertoire de travail du serveur serve
COPY --from=builder /app/build /app

# Exposer le port 80 pour le trafic HTTP
EXPOSE 8080

RUN ls static/

# La commande CMD est utilisée pour démarrer serve lorsque le conteneur démarre
CMD ["serve", "-s", "-n", ".", "-p", "8080"]
