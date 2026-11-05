FROM docker.io/library/node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/main.mjs"]