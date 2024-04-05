FROM node:14 AS build
LABEL maintaner "tomstoughton1@gmail.com"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19-alpine AS production
COPY --from=build /app/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]