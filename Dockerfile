FROM node:21.3.0
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
COPY . /app
COPY ./cypress ./cypress
COPY cypress.config.ts .
RUN npm i -g yarn@latest npm@latest
RUN npm install
RUN npm install --save-dev @simonsmith/cypress-image-snapshot
RUN ["npm", "run", "cy:run"]
ENV PORT=8080
EXPOSE 8080
CMD [ "" ]