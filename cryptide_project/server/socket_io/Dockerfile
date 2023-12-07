# Use the official Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./server/socket_io/server.js .

# Expose the port that the application will run on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["node", "server.js"]
