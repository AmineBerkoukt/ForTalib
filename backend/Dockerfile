# Use Node.js as the base image
FROM node:20-alpine

# Create app directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application
COPY . .


# Command to run the application using npm start
CMD ["npm", "start"]