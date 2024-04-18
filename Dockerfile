# Use a base image with Node.js installed
FROM ubuntu:latest
 
# Update package lists and install curl
RUN apt-get update && apt-get install -y curl
 
# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json to the container
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of the application code to the container
COPY . .
 
# Expose the port the app runs on
EXPOSE 3000
 
# Command to run your application
CMD ["npm", "run", "start"]