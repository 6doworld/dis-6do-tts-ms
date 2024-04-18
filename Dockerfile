# Use a base image with Node.js installed
FROM node:21-alpine3.18

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# # Create the sqliteStorage directory
# RUN mkdir -p /sqliteStorage

# # Create the database.sqlite file inside sqliteStorage
# RUN touch /sqliteStorage/database.sqlite

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start:dev"]
