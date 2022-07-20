FROM node:18-alpine
RUN mkdir -p /home/node/app/src
WORKDIR /home/node/app

COPY package.json .
COPY tsconfig.json .
RUN npm install

COPY src/ src
COPY index.ts .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]
