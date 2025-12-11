# FROM node:22

# WORKDIR /app

# COPY package*.json .

# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD [ "npm", "run", "dev" ]


# ============== Build Stage ==============
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
COPY vite.config.js ./
COPY .env* ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# ============== Production Stage ==============
FROM node:20-alpine AS production

# Install serve globally to serve static files efficiently
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy only the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Vite default is 5173, but serve defaults to 3000)
EXPOSE 3000


# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]