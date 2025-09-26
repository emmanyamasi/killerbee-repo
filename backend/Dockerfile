# Use Node.js LTS version
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Default command
# For development, use nodemon; for production, use npm start
CMD ["npm", "run", "dev"]
