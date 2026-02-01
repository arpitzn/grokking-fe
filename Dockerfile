FROM node:22.13.0-alpine
WORKDIR /usr/src/app

# Build arguments for Vite environment variables
ARG VITE_API_BASE_URL=http://3.6.105.82
ARG VITE_USER_ID=demo_user

# Set as environment variables for Vite build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_USER_ID=${VITE_USER_ID}

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# The dist/ folder contains the production build artifacts
# This will be copied out or mounted for S3 deployment
