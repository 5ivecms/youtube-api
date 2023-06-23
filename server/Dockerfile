FROM node:16.16.0-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]

FROM base AS production
RUN npm install --production
COPY . .
RUN npm install -g @nestjs/cli
RUN npm run build
CMD ["npm", "run", "start:prod"]