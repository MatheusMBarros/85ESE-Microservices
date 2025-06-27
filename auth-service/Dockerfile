FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS dependencies
# Instala tanto as dependências de produção quanto as de desenvolvimento (nodemon)
# para que o hot-reloading funcione com os volumes de desenvolvimento.
RUN npm install && npm cache clean --force

FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
