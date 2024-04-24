FROM node:lts-alpine
ENV LAST_UPDATED 20240410

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