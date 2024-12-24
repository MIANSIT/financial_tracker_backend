# Use Node.js as the base image
FROM node:18

# Install MongoDB in the image
RUN apt-get update && apt-get install -y gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian $(lsb_release -sc)/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-org && \
    mkdir -p /data/db

# Set the working directory for the NestJS app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the NestJS application
RUN npm run build

# Install Supervisor to manage multiple processes
RUN apt-get install -y supervisor

# Copy the Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose MongoDB and NestJS ports
EXPOSE 27017 3000

# Start Supervisor to manage MongoDB and NestJS
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
