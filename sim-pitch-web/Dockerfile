# Stage 1: Build Vue app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist . 
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Podmiana zmiennych środowiskowych i uruchomienie Nginx
CMD envsubst '$API_URL' < /etc/nginx/conf.d/default.conf.template \
    > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
