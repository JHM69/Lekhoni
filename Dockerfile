# Use an official Node runtime as a base image
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire application's source code from the current directory to the working directory in the container
COPY ./ .


# Install dependencies
RUN npm install --force

# Install Prisma CLI
RUN npm install prisma@latest --force

# Generate Prisma Client
RUN npx prisma generate

# Build the app in Case you want see the Production build else you can replace it with npm run dev
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
