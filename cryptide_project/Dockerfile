# Étape 1 : Construire l'application React
FROM node:14 AS build

WORKDIR /app

# Copier le fichier package.json et yarn.lock (ou package-lock.json si vous utilisez npm)
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --force

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Configurer Nginx et copier les fichiers construits
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration personnalisée pour Nginx (si nécessaire)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx lorsqu'un conteneur basé sur cette image est lancé
CMD ["nginx", "-g", "daemon off;"]
