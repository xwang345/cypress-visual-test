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
# Give execute permissions to the script
RUN chmod +x start_cypress_e2e.sh
RUN npm install