FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN ls

EXPOSE 80
#
# Installez express
RUN npm install express

# Copiez le script serveur personnalisé
COPY server.js ./build/

# Commande pour démarrer le serveur personnalisé
CMD ["node", "build/server.js"]
