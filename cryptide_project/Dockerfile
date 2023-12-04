# Utilisation d'une image de Node.js avec Alpine Linux comme système d'exploitation de base
FROM node:14-alpine as builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

RUN ls ./

# Installer les dépendances
RUN npm install --force

# Copier les fichiers du projet dans le conteneur
COPY . .

# Construire l'application React
RUN npm run build

# Utiliser une image légère basée sur Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits à partir du builder vers le répertoire de travail du serveur Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Exposer le port 80 pour le trafic HTTP
EXPOSE 80

# La commande CMD est utilisée pour démarrer le serveur Nginx lorsque le conteneur démarre
CMD ["nginx", "-g", "daemon off;"]
