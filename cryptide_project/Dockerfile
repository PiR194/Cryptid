# Étape 1 : Construire l'application React
FROM node:14 AS build

WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Configurer Apache et copier les fichiers construits
FROM httpd:2.4-alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build/ /usr/local/apache2/htdocs/

RUN touch /usr/local/apache2/conf/httpd.conf

RUN echo "AddType text/css .css" >> /usr/local/apache2/conf/httpd.conf
RUN echo "AddType application/javascript .js" >> /usr/local/apache2/conf/httpd.conf

RUN ls /usr/local/apache2/conf/httpd.conf
# Exposer le port 80 (par défaut pour Apache)
EXPOSE 80
