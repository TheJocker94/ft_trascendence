# Use the official Node.js Alpine image as the base image
FROM node:alpine

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3000

CMD [ "/bin/sh", "-c", "npx prisma db push && npm run start" ]
