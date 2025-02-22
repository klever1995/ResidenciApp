# Etapa de construcción
FROM node:alpine3.18 as build

# Declarar variables de entorno en tiempo de construcción
ARG REACT_APP_NODE_ENV=production
ARG REACT_APP_LOCAL_BASE_URL=http://localhost:4000
ARG REACT_APP_SERVER_BASE_URL=http://localhost:4000

# Establecer variables de entorno
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_LOCAL_BASE_URL=$REACT_APP_LOCAL_BASE_URL
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

# Construir la aplicación
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:1.23-alpine

# Copiar archivos de construcción
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]