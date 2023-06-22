FROM node:16.16.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true
ENV FAST_REFRESH=false

EXPOSE 3000

# CMD ["npm", "run", "start-watch"]