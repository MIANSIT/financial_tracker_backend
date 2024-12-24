# Use an official Node.js image as the base
FROM node:18-alpine as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the NestJS app
RUN npm run build

# Use a lightweight image for the final container
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the build files and dependencies from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Expose the port for the NestJS app
EXPOSE 3000

# Start the NestJS app
CMD ["node", "dist/main.js"]
