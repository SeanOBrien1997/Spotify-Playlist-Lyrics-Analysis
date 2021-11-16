# Pull node base image from Docker Hub
FROM node:14

# Create working directory
WORKDIR /usr/app/

# Copy package dependencies 
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source files
COPY  public ./public/
COPY src ./src/
COPY tsconfig*.json .
