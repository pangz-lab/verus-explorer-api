FROM node:lts-alpine as base

# Copy source code
COPY . .

# Install dependencies
ENV NODE_ENV=PRODUCTION
RUN npm install && npm run build && cp .env ./dist/.env

EXPOSE 2220
# Launch application
CMD ["node","./dist/index.js"]