FROM node:20

WORKDIR /frontend

# Copy package.json and package-lock.json for caching
COPY package*.json ./

# Clean any existing node_modules or lock files (optional, but safe)
RUN rm -rf node_modules package-lock.json

# Install dependencies with clean install
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready frontend
RUN npm run build

# Run the preview server on all interfaces and port 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
