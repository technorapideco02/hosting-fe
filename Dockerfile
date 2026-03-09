FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install dependencies dependencies
RUN npm install

# Copy all files
COPY . .

# Build the Vite app
RUN npm run build


# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose internal port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
