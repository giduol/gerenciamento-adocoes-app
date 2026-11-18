# Etapa 1: build de produção do Angular
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servir os arquivos estáticos com nginx
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/gerenciamento-adocoes/browser /usr/share/nginx/html

EXPOSE 8080
