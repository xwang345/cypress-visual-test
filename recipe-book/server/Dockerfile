# Use an official Node.js runtime as the base image
FROM node:lts

# Set the bash to use in the Docker image
SHELL ["/bin/bash", "-c"]

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm install

# Copy the rest of the application into the image
COPY . .