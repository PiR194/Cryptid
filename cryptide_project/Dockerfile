# Utilisez l'image Node.js LTS comme base
FROM node:14-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez le reste des fichiers de l'application dans le conteneur
COPY . .

# Construisez l'application React
RUN npm run build

# Utilisez l'image légère Nginx pour servir l'application construite
FROM nginx:alpine

# Copiez les fichiers construits de l'étape précédente dans le répertoire de travail de Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Exposez le port 80 pour que l'application puisse être accessible
EXPOSE 80

# Commande pour démarrer Nginx lorsque le conteneur est lancé
ENTRYPOINT ["nginx", "-g", "daemon off;"]
