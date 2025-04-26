# Use Node.js LTS (Long Term Support) version
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Create .env file from environment variables
RUN echo "JWT_SECRET=${JWT_SECRET}\n\
MONGO_URI=${MONGO_URI}\n\
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}\n\
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}" > .env

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]