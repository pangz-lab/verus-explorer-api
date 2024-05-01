FROM node:lts-alpine

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Expose API port to the outside
EXPOSE 2220

# Launch application
CMD ["npm","start"]