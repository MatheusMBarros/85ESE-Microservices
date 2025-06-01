FROM node:18-alpine As base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base As dependencies
RUN npm install --omit=dev --no-optional && npm cache clean --force

FROM base As production
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
CMD [ "npm", "start" ]