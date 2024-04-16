# Use Node.js 14 LTS as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Nest.js application will run (replace 3000 with your actual port)
EXPOSE 3000

# Command to run your Nest.js application
CMD ["npm", "run", "start:prod"]
