FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# Vite dev server — binds to 0.0.0.0 so it is reachable from docker network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
