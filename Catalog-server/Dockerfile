# Use a base image with Node.js
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the catalog server will run on
EXPOSE 4002

# Command to run the catalog server
CMD ["node", "catalog.js"]
