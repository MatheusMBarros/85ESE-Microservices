FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS dependencies
RUN npm install && npm cache clean --force

FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3002
CMD ["npm", "start"]