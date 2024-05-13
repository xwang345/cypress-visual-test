# Dockerfile for the Recipe Book application
FROM node:20.11.0 AS build
RUN mkdir /app
WORKDIR /app
RUN apt-get update && apt-get install -y \
  libgtk2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use an official Nginx runtime as the base image
FROM nginx:stable
SHELL ["/bin/bash", "-c"]
RUN apt-get update && apt-get install -y \
  vim \
  nano
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/recipe-book/browser /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]