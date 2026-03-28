FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the API port
EXPOSE 3002

# The start command will be provided by docker-compose to handle migrations
CMD ["npm", "run", "start"]
