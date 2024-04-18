# Use a base image with Node.js installed
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Create the sqliteStorage directory and the database.sqlite file
RUN mkdir -p /app/sqliteStorage && touch /app/sqliteStorage/database.sqlite

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start"]
