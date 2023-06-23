FROM node:16.16.0-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS production
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

FROM base AS development
ENV CHOKIDAR_USEPOLLING=true
ENV FAST_REFRESH=true
CMD ["npm", "run", "start-watch"]