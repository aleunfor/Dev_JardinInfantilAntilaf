FROM node:13-alpine
RUN mkdir -p /app
WORKDIR /app
COPY .package*.json ./
COPY . .
RUN npm install
EXPOSE 3000
CMD node ./www